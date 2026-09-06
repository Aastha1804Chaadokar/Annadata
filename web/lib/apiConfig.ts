/**
 * Centralized API configuration for Annadata Web
 * Supports local development, Vercel deployments, Next.js rewrites proxying, and custom backend URLs.
 */

const getApiBaseUrl = (): string => {
  // 1. If explicitly configured via environment variable (e.g. on Vercel / Render)
  if (process.env.NEXT_PUBLIC_API_URL) {
    const configured = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    if (configured) return configured;
  }

  // 2. In browser, dynamically resolve based on the active environment
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;

    // When running on Vercel or any deployed domain, relative /api/v1 uses Next.js rewrites proxy
    // This completely prevents CORS preflight blocking, mixed content, and SSL mismatch errors.
    if (hostname.endsWith('.vercel.app') || (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.') && !hostname.startsWith('10.'))) {
      return '/api/v1';
    }

    // If accessing from a mobile device on the local network (e.g. 192.168.x.x or 10.x.x.x)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api/v1`;
    }
  }

  // 3. Local development default
  return 'http://localhost:5000/api/v1';
};

export const getApiUrl = (): string => getApiBaseUrl();

export const API_ENDPOINTS = {
  get BASE() { return getApiBaseUrl(); },
  get HEALTH() { return `${getApiBaseUrl()}/health`; },
  get AUTH_LOGIN() { return `${getApiBaseUrl()}/auth/login`; },
  get AUTH_REGISTER() { return `${getApiBaseUrl()}/auth/register`; },
  get AUTH_LOGOUT() { return `${getApiBaseUrl()}/auth/logout`; },
  get FARMER_PROFILE() { return `${getApiBaseUrl()}/farmers/profile`; },
  get LOCATION_REVERSE_GEOCODE() { return `${getApiBaseUrl()}/location/reverse-geocode`; },
  get SOIL_REPORTS() { return `${getApiBaseUrl()}/soil-reports`; },
  get CROP_RECOMMENDATIONS() { return `${getApiBaseUrl()}/crop-recommendations`; },
  get WEATHER() { return `${getApiBaseUrl()}/weather`; },
  get ASSISTANT_CHAT() { return `${getApiBaseUrl()}/assistant/chat`; },
};
