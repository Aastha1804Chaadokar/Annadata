import { FarmerProfile } from '@/types/farmer';

const STORAGE_KEY = 'annadata_farmer_profile';

export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  name: 'Ram Singh',
  mobile: '9876543210',
  state: 'Madhya Pradesh',
  district: 'Indore',
  village: 'Sanwer',
  language: 'Hindi (हिन्दी)',
  farmingType: 'Small farmer',
  mainCrop: 'Soybean (सोयाबीन)',
  landSize: '3.5',
  landUnit: 'Acres',
  irrigation: 'Rain-fed',
  channelPreference: 'Smartphone',
  createdAt: new Date().toISOString(),
};

export const getFarmerProfile = (): FarmerProfile => {
  if (typeof window === 'undefined') return DEFAULT_FARMER_PROFILE;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_FARMER_PROFILE;
    return JSON.parse(data) as FarmerProfile;
  } catch (e) {
    return DEFAULT_FARMER_PROFILE;
  }
};

export const saveFarmerProfile = (profile: FarmerProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save farmer profile to localStorage', e);
  }
};

export const clearFarmerProfile = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear farmer profile', e);
  }
};

export const hasCompletedOnboarding = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEY);
};
