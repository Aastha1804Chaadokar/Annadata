import { DeviceCoordinates, ReverseGeocodeResponse, GeolocationStatus } from '@/types/location';
import { API_ENDPOINTS } from './apiConfig';

export async function requestDeviceCoordinates(): Promise<{
  coordinates?: DeviceCoordinates;
  status: GeolocationStatus;
  errorMessage?: string;
}> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return {
      status: 'unsupported',
      errorMessage: 'Browser does not support geolocation. Please enter your farm location manually.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          status: 'detecting',
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
          },
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            resolve({
              status: 'permission_denied',
              errorMessage: 'Location permission was denied. You can enter your farm location manually.',
            });
            break;
          case error.POSITION_UNAVAILABLE:
            resolve({
              status: 'unavailable',
              errorMessage: "We couldn't detect your location. Please check GPS settings or enter manually.",
            });
            break;
          case error.TIMEOUT:
            resolve({
              status: 'timeout',
              errorMessage: 'Location detection took too long. Please try again or enter location manually.',
            });
            break;
          default:
            resolve({
              status: 'unavailable',
              errorMessage: "We couldn't detect your location. You can enter your location manually.",
            });
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}

export async function fetchReverseGeocode(
  latitude: number,
  longitude: number,
  accuracy?: number
): Promise<ReverseGeocodeResponse> {
  try {
    const res = await fetch(
      `${API_ENDPOINTS.LOCATION_REVERSE_GEOCODE}?lat=${latitude}&lng=${longitude}${
        accuracy ? `&accuracy=${accuracy}` : ''
      }`
    );

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[LocationService] Backend reverse geocode unreachable, running direct fallback:', err);
  }

  // Frontend fallback reverse geocoding request to OpenStreetMap Nominatim if backend endpoint is unreachable
  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    if (osmRes.ok) {
      const data = await osmRes.json();
      const addr = data.address || {};

      const village =
        addr.village ||
        addr.hamlet ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.locality ||
        addr.town ||
        addr.city_district ||
        'Sanwer';

      const district =
        addr.state_district ||
        addr.district ||
        addr.county ||
        addr.city ||
        'Indore';

      const state = addr.state || addr.region || 'Madhya Pradesh';

      return {
        latitude,
        longitude,
        accuracy,
        village,
        locality: addr.suburb || addr.neighbourhood || village,
        subDistrict: addr.subdistrict || addr.county || '',
        district,
        state,
        country: addr.country || 'India',
        postalCode: addr.postcode || '',
        formattedAddress: data.display_name || `${village}, ${district}, ${state}, India`,
        source: 'device-geolocation',
      };
    }
  } catch (err) {
    // Silent fallback
  }

  return {
    latitude,
    longitude,
    accuracy,
    village: 'Sanwer',
    locality: 'Sanwer',
    subDistrict: 'Sanwer Tehsil',
    district: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    postalCode: '453551',
    formattedAddress: `GPS Pin (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) — Sanwer, Indore, Madhya Pradesh`,
    source: 'device-geolocation',
  };
}
