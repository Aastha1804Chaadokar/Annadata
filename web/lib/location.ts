import { GeocodedLocation } from '@/types/farmer';

// Default center coordinates: Indore / Central India
export const DEFAULT_INDIA_CENTER: GeocodedLocation = {
  latitude: 22.7196,
  longitude: 75.8577,
  accuracy: 15,
  formattedAddress: 'Indore, Madhya Pradesh, India',
  village: 'Indore',
  locality: 'Indore City',
  tehsil: 'Indore',
  taluka: 'Indore',
  subDistrict: 'Indore',
  district: 'Indore',
  state: 'Madhya Pradesh',
  country: 'India',
  pinCode: '452001',
};

/**
 * Helper to map Nominatim item.address into standardized Indian administrative hierarchy
 */
function mapNominatimAddress(item: any): GeocodedLocation {
  const addr = item.address || {};

  const village =
    addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.town || addr.city || '';

  const locality =
    addr.suburb || addr.neighbourhood || addr.residential || addr.locality || village || '';

  const tehsil =
    addr.subdistrict ||
    addr.tehsil ||
    addr.taluka ||
    addr.county ||
    addr.municipality ||
    addr.district ||
    '';

  const district =
    addr.state_district || addr.district || addr.county || addr.city || tehsil || '';

  const state = addr.state || '';
  const country = addr.country || 'India';
  const pinCode = addr.postcode || '';
  const postOffice = addr['post office'] || addr.suburb || pinCode || '';

  return {
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    formattedAddress: item.display_name,
    village,
    locality,
    postOffice,
    pinCode,
    tehsil,
    taluka: tehsil,
    subDistrict: tehsil,
    district,
    state,
    country,
  };
}

/**
 * Search Indian locations (villages, towns, cities, tehsils, districts, states, PIN codes)
 */
export async function searchIndianLocations(query: string): Promise<GeocodedLocation[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const encoded = encodeURIComponent(`${query.trim()}, India`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=in&addressdetails=1&limit=8`,
      {
        headers: {
          'User-Agent': 'Annadata-Agritech-Portal/1.0',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item: any) => mapNominatimAddress(item));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates (lat, lon) into readable Indian administrative hierarchy
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number,
  accuracy?: number
): Promise<GeocodedLocation> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Annadata-Agritech-Portal/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const item = await response.json();
    const mapped = mapNominatimAddress(item);

    return {
      ...mapped,
      latitude: lat,
      longitude: lon,
      accuracy: accuracy || mapped.accuracy,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      latitude: lat,
      longitude: lon,
      accuracy,
      formattedAddress: `Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      village: '',
      locality: '',
      postOffice: '',
      pinCode: '',
      tehsil: '',
      taluka: '',
      subDistrict: '',
      district: '',
      state: '',
      country: 'India',
    };
  }
}

/**
 * Browser Geolocation Helper returning latitude, longitude, and accuracy
 */
export function getCurrentBrowserLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
        });
      },
      (error) => {
        let msg = 'Failed to retrieve your current location';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can search for your farm or select it manually on the map.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please retry or search manually.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });
}
