export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ReverseGeocodeResponse {
  latitude: number;
  longitude: number;
  accuracy?: number;
  village: string;
  locality?: string;
  subDistrict?: string;
  district: string;
  state: string;
  country: string;
  postalCode?: string;
  formattedAddress?: string;
  source: 'device-geolocation';
}

export interface StructuredFarmLocation {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accuracy?: number;
  village: string;
  locality?: string;
  subDistrict?: string;
  district: string;
  state: string;
  country: string;
  postalCode?: string;
  formattedAddress?: string;
  source: 'device-geolocation' | 'manual';
  locationUpdatedAt?: string;
}

export type GeolocationStatus =
  | 'idle'
  | 'requesting_permission'
  | 'detecting'
  | 'reverse_geocoding'
  | 'success'
  | 'permission_denied'
  | 'unavailable'
  | 'timeout'
  | 'unsupported'
  | 'reverse_error';
