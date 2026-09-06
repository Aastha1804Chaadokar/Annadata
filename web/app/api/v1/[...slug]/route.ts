import { NextRequest, NextResponse } from 'next/server';

/**
 * Universal Next.js API Proxy for Annadata
 * Forwards frontend API requests to the Render backend or local Express API.
 * Eliminates browser CORS, SSL mismatch, and cross-origin preflight errors.
 */

const getBackendTargetUrl = (): string => {
  let url = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  if (url) {
    url = url.replace(/\/+$/, '');
    if (!url.endsWith('/api/v1')) {
      if (url.endsWith('/api')) {
        url = `${url}/v1`;
      } else {
        url = `${url}/api/v1`;
      }
    }
    return url;
  }
  // When deployed on Vercel without explicit env var, default to production Render URL
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return 'https://annadata-backend.onrender.com/api/v1';
  }
  // Local development & local node server default
  return 'http://127.0.0.1:5000/api/v1';
};

async function handleProxy(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slugPath = params.slug ? params.slug.join('/') : '';
  const backendBase = getBackendTargetUrl();
  const search = req.nextUrl.search || '';
  const targetUrl = `${backendBase}/${slugPath}${search}`;

  const method = req.method;
  const headers = new Headers();

  // Forward necessary headers
  req.headers.forEach((val, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, val);
    }
  });

  let body: BodyInit | undefined = undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    try {
      body = await req.text();
    } catch {
      body = undefined;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    const responseData = await backendRes.text();
    const contentType = backendRes.headers.get('content-type') || 'application/json';

    return new NextResponse(responseData, {
      status: backendRes.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Backend request timed out. The server may be waking up from sleep, please try again.',
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to connect to authentication server. Please check that the Render backend service is online.',
      },
      { status: 503 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
