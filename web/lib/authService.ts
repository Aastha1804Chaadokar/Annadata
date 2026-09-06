import { API_ENDPOINTS } from './apiConfig';

export interface AuthUser {
  id?: string;
  name: string;
  mobile: string;
  language?: string;
  state?: string;
  district?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}

const SESSION_TOKEN_KEY = 'annadata_session_token';
const AUTH_USER_KEY = 'annadata_auth_user';

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  return !!token;
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
};

export const normalizeIndianMobile = (mobile: string): string => {
  let clean = mobile.replace(/\D/g, '').trim();
  if (clean.length === 12 && clean.startsWith('91')) {
    clean = clean.slice(2);
  } else if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }
  return clean;
};

export const login = async (mobile: string, password: string): Promise<AuthResponse> => {
  const cleanMobile = normalizeIndianMobile(mobile);
  const cleanPassword = password.trim();

  if (!cleanMobile || cleanMobile.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  if (!cleanPassword) {
    return { success: false, error: 'Please enter your password.' };
  }

  const endpoint = API_ENDPOINTS.AUTH_LOGIN;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ mobile: cleanMobile, password: cleanPassword }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (response.ok && data?.success && data?.data?.token) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      return { success: true, message: data.message, data: data.data };
    }

    return {
      success: false,
      error: data?.error || 'Invalid mobile number or password.',
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Authentication request timed out. The server may be waking up, please try again in a few seconds.',
      };
    }
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please check your internet connection or try again.',
    };
  }
};

export const register = async (
  name: string,
  mobile: string,
  password: string,
  extraFields?: { language?: string; state?: string; district?: string }
): Promise<AuthResponse> => {
  const cleanName = name.trim();
  const cleanMobile = normalizeIndianMobile(mobile);
  const cleanPassword = password.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!cleanMobile || cleanMobile.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, error: 'Please create a password with at least 4 characters.' };
  }

  const endpoint = API_ENDPOINTS.AUTH_REGISTER;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: cleanName,
        mobile: cleanMobile,
        password: cleanPassword,
        language: extraFields?.language || 'hi',
        state: extraFields?.state || '',
        district: extraFields?.district || '',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (response.ok && data?.success && data?.data?.token) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      return { success: true, message: data.message, data: data.data };
    }

    return {
      success: false,
      error: data?.error || 'Registration failed. Please try again.',
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Registration request timed out. The server may be waking up, please try again.',
      };
    }
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please check your internet connection or try again.',
    };
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await fetch(API_ENDPOINTS.AUTH_LOGOUT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Ignore network failure on logout
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return true;
};
