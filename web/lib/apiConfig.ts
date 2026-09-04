/**
 * Centralized API configuration for Annadata Web
 * Supports local development, Vercel deployments, and custom backend URLs.
 */

const getApiBaseUrl = (): string => {
  // If explicitly configured via environment variable (e.g. on Vercel)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  // In browser, if running on non-localhost without an env var, use current origin with /api/v1 if proxied
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'http://localhost:5000/api/v1'; // Default fallback or configured via NEXT_PUBLIC_API_URL
  }

  // Local development default
  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  FARMER_PROFILE: `${API_BASE_URL}/farmers/profile`,
  LOCATION_REVERSE_GEOCODE: `${API_BASE_URL}/location/reverse-geocode`,
  SOIL_REPORTS: `${API_BASE_URL}/soil-reports`,
  CROP_RECOMMENDATIONS: `${API_BASE_URL}/crop-recommendations`,
  WEATHER: `${API_BASE_URL}/weather`,
  ASSISTANT_CHAT: `${API_BASE_URL}/assistant/chat`,
};
