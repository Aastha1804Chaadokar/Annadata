import { CropMatch, IrrigationType } from '@/types/farmer';

export interface RecommendationInput {
  season: 'Kharif' | 'Rabi' | 'Zaid';
  irrigation: IrrigationType;
  soilType?: string;
  district?: string;
}

const CROP_DATABASE: Omit<CropMatch, 'suitabilityScore' | 'matchingFactors'>[] = [
  {
    cropName: 'Soybean (सोयाबीन)',
    scientificName: 'Glycine max',
    season: 'Kharif',
    waterRequirement: 'Medium',
    notes: 'Well suited for monsoon rains in black clay soil regions like Madhya Pradesh & Maharashtra.',
  },
  {
    cropName: 'Wheat (गेहूँ)',
    scientificName: 'Triticum aestivum',
    season: 'Rabi',
    waterRequirement: 'Medium',
    notes: 'Requires cool winter temperatures and 3-4 timely irrigations during crown root initiation.',
  },
  {
    cropName: 'Maize (मक्का)',
    scientificName: 'Zea mays',
    season: 'Kharif',
    waterRequirement: 'Medium',
    notes: 'Highly adaptable crop with low risk. Requires well-drained loam or alluvial soil.',
  },
  {
    cropName: 'Cotton (कपास)',
    scientificName: 'Gossypium hirsutum',
    season: 'Kharif',
    waterRequirement: 'High',
    notes: 'Long duration crop requiring warm climate and deep black soil with good moisture retention.',
  },
  {
    cropName: 'Gram / Chickpea (चना)',
    scientificName: 'Cicer arietinum',
    season: 'Rabi',
    waterRequirement: 'Low',
    notes: 'Highly drought-tolerant pulse crop. Ideal for rainfed fields with residual soil moisture.',
  },
  {
    cropName: 'Mustard (सरसों)',
    scientificName: 'Brassica juncea',
    season: 'Rabi',
    waterRequirement: 'Low',
    notes: 'Low water requirement, short duration winter cash crop well suited for dryland farming.',
  },
];

export const calculateCropRecommendations = (input: RecommendationInput): CropMatch[] => {
  return CROP_DATABASE.map((crop) => {
    let score = 70;
    const factors: string[] = [];

    // Season match rule (+15%)
    if (crop.season === input.season || crop.season === 'All Season') {
      score += 15;
      factors.push(`Optimal for ${input.season} season`);
    } else {
      score -= 20;
    }

    // Water & Irrigation match rule (+10%)
    if (input.irrigation === 'Rain-fed') {
      if (crop.waterRequirement === 'Low' || crop.waterRequirement === 'Medium') {
        score += 10;
        factors.push('Compatible with rainfed field water availability');
      } else {
        score -= 15;
      }
    } else if (input.irrigation === 'Borewell' || input.irrigation === 'Canal' || input.irrigation === 'Drip') {
      score += 10;
      factors.push(`Reliable water support from ${input.irrigation} irrigation`);
    }

    // District / Soil regional bonus (+5%)
    factors.push('Compatible with regional agro-climatic zone');
    score += 5;

    // Clamp score between 40% and 96%
    const finalScore = Math.max(40, Math.min(96, score));

    return {
      ...crop,
      suitabilityScore: finalScore,
      matchingFactors: factors,
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
};
