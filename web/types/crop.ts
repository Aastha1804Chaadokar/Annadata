export interface CropDetails {
  id: string;
  cropName: string;
  hindiName: string;
  scientificName: string;
  suitableSeasons: Array<'Kharif' | 'Rabi' | 'Zaid'>;
  preferredSoilTypes: string[];
  phRange: { min: number; max: number };
  preferredNPK: { N: string; P: string; K: string };
  waterRequirement: 'Low' | 'Medium' | 'High';
  temperatureRange: { min: number; max: number; unit: string };
  majorRegions: string[];
  basicSoilRequirements: string;
  cultivationConsiderations: string;
  potentialRisks: string;
}

export interface CropRecommendationInput {
  season: 'Kharif' | 'Rabi' | 'Zaid';
  irrigation: string;
  soil?: {
    ph?: number;
    nitrogen?: { value: number; unit: string };
    phosphorus?: { value: number; unit: string };
    potassium?: { value: number; unit: string };
    organicCarbon?: { value: number; unit: string };
    soilType?: string;
  };
  location?: {
    state?: string;
    district?: string;
    village?: string;
  };
  previousCrop?: string;
  currentCrop?: string;
  landSize?: string;
}

export interface RankedCropResult {
  crop: string;
  hindiName?: string;
  scientificName?: string;
  suitability: number;
  reasons: string[];
  whyNot?: string[];
  waterRequirement?: string;
  suitableSeasons?: string[];
  preferredSoilTypes?: string[];
  detailsUrl?: string;
}

export interface SavedCropRecommendation {
  id: string;
  farmerId: string;
  farmId: string;
  season: string;
  inputSnapshot: CropRecommendationInput;
  recommendations: RankedCropResult[];
  engineType: string;
  disclaimer: string;
  createdAt: string;
}
