import { StructuredFarmLocation } from './location';

export type FarmingType = 'Small farmer' | 'Medium farmer' | 'Large farmer' | 'Other';

export type IrrigationType = 'Rain-fed' | 'Borewell' | 'Canal' | 'Drip' | 'Other';

export type CommunicationChannel = 'Smartphone' | 'Voice' | 'SMS';

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  accuracy?: number; // In meters
  formattedAddress: string;
  village?: string;
  locality?: string;
  city?: string;
  postOffice?: string;
  pinCode?: string;
  tehsil?: string; // Sub-district / Taluka
  taluka?: string;
  subDistrict?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface CurrentCropData {
  cropId: string;
  cropName: string;
  cropNameHi: string;
  category: string;
  customCropName?: string;
}

export interface FarmerProfile {
  name: string;
  mobile: string;
  state: string;
  district: string;
  village: string;
  language: string;
  farmingType: FarmingType;
  mainCrop: string;
  currentCrop?: CurrentCropData;
  landSize: string;
  landUnit: 'Acres' | 'Bigha' | 'Hectares';
  irrigation: IrrigationType;
  soilType?: string;
  channelPreference: CommunicationChannel;
  createdAt: string;
  // Spatial & Administrative Location Data
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  formattedAddress?: string;
  locality?: string;
  city?: string;
  postOffice?: string;
  pincode?: string;
  tehsil?: string;
  taluka?: string;
  subDistrict?: string;
  country?: string;
  structuredLocation?: StructuredFarmLocation;
}

export interface SoilParameters {
  pH: number;
  nitrogen: 'Low' | 'Medium' | 'High';
  phosphorus: 'Low' | 'Medium' | 'High';
  potassium: 'Low' | 'Medium' | 'High';
  organicCarbon: 'Low' | 'Medium' | 'High';
  isSampleData?: boolean;
}

export interface CropMatch {
  cropName: string;
  scientificName: string;
  suitabilityScore: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
  waterRequirement: 'Low' | 'Medium' | 'High';
  matchingFactors: string[];
  notes: string;
}
