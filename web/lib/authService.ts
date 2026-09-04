import { API_ENDPOINTS } from './apiConfig';

export interface AuthUser {
  id?: string;
  name: string;
  mobile: string;
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
  } catch (e) {
    return null;
  }
};

export const login = async (mobile: string, password?: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password: password || '123456' }),
    });

    const data = await response.json();
    if (response.ok && data.success && data.data) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      return { success: true, data: data.data };
    }
    return { success: false, error: data.error || 'Invalid credentials' };
  } catch (err: any) {
    // Offline / Fallback login authorization
    const fallbackUser: AuthUser = {
      name: 'Ram Singh',
      mobile,
    };
    const fallbackToken = `session_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, fallbackToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
    return {
      success: true,
      message: 'Logged in locally',
      data: { token: fallbackToken, user: fallbackUser },
    };
  }
};

export const register = async (
  name: string,
  mobile: string,
  password?: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, password: password || '123456' }),
    });

    const data = await response.json();
    if (response.ok && data.success && data.data) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      return { success: true, data: data.data };
    }
    return { success: false, error: data.error || 'Registration failed' };
  } catch (err: any) {
    const fallbackUser: AuthUser = { name, mobile };
    const fallbackToken = `session_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, fallbackToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
    return {
      success: true,
      message: 'Registered locally',
      data: { token: fallbackToken, user: fallbackUser },
    };
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await fetch(API_ENDPOINTS.AUTH_LOGOUT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // Ignore network error on logout
  }

  // Clear ONLY authentication session keys
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return true;
};
