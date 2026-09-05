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

export const login = async (mobile: string, password: string): Promise<AuthResponse> => {
  const cleanMobile = mobile.replace(/\D/g, '').trim();
  const cleanPassword = password.trim();

  if (!cleanMobile || cleanMobile.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  if (!cleanPassword) {
    return { success: false, error: 'Please enter your password.' };
  }

  try {
    const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: cleanMobile, password: cleanPassword }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data?.token) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      return { success: true, message: data.message, data: data.data };
    }

    return {
      success: false,
      error: data.error || 'Invalid mobile number or password.',
    };
  } catch {
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please try again.',
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
  const cleanMobile = mobile.replace(/\D/g, '').trim();
  const cleanPassword = password.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!cleanMobile || cleanMobile.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, error: 'Please create a password with at least 4 characters.' };
  }

  try {
    const response = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        mobile: cleanMobile,
        password: cleanPassword,
        language: extraFields?.language || 'hi',
        state: extraFields?.state || '',
        district: extraFields?.district || '',
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data?.token) {
      localStorage.setItem(SESSION_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      return { success: true, message: data.message, data: data.data };
    }

    return {
      success: false,
      error: data.error || 'Registration failed. Please try again.',
    };
  } catch {
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please try again.',
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
