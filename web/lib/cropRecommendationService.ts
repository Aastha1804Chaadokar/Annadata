import { CropRecommendationInput, RankedCropResult, SavedCropRecommendation } from '@/types/crop';
import { CROP_DATASET } from './cropKnowledgeData';

const RECOMMENDATION_HISTORY_KEY = 'annadata_crop_recommendation_history';

export const runCropRecommendationEngine = (
  input: CropRecommendationInput
): {
  season: string;
  engineType: string;
  disclaimer: string;
  recommendations: RankedCropResult[];
} => {
  const scoredCrops: RankedCropResult[] = CROP_DATASET.map((crop) => {
    let score = 50;
    const reasons: string[] = [];
    const whyNot: string[] = [];

    // 1. Season Evaluation (+30 pts)
    if (crop.suitableSeasons.includes(input.season)) {
      score += 30;
      reasons.push(`✓ Suitable for ${input.season} season`);
    } else {
      score -= 25;
      whyNot.push(`✕ Primary season is ${crop.suitableSeasons.join(', ')} rather than ${input.season}`);
    }

    // 2. Irrigation & Water Requirement (+20 pts)
    const userIrrigation = input.irrigation || 'Rain-fed';
    if (userIrrigation === 'Rain-fed') {
      if (crop.waterRequirement === 'Low') {
        score += 20;
        reasons.push('✓ Excellent match for rain-fed dryland fields');
      } else if (crop.waterRequirement === 'Medium') {
        score += 10;
        reasons.push('✓ Compatible with rain-fed field water availability');
      } else {
        score -= 15;
        whyNot.push('✕ High water requirement crop requires assured irrigation (Canal/Borewell)');
      }
    } else {
      if (crop.waterRequirement === 'High' || crop.waterRequirement === 'Medium') {
        score += 20;
        reasons.push(`✓ Assured water support from ${userIrrigation} irrigation`);
      } else {
        score += 15;
        reasons.push(`✓ Low water requirement conserves groundwater under ${userIrrigation}`);
      }
    }

    // 3. Soil Type (+15 pts)
    const userSoilType = input.soil?.soilType;
    if (userSoilType && userSoilType !== 'Unknown' && userSoilType !== "I don't know") {
      if (crop.preferredSoilTypes.includes(userSoilType) || crop.preferredSoilTypes.includes('All')) {
        score += 15;
        reasons.push(`✓ Soil type (${userSoilType}) is compatible with root growth`);
      } else {
        score += 5;
        whyNot.push(`✕ Prefers ${crop.preferredSoilTypes.join(' or ')} soil over ${userSoilType}`);
      }
    } else {
      score += 10;
      reasons.push('✓ Broadly adaptable across typical regional soil types');
    }

    // 4. pH Range (+15 pts)
    const userPh = input.soil?.ph;
    if (typeof userPh === 'number' && userPh > 0) {
      if (userPh >= crop.phRange.min && userPh <= crop.phRange.max) {
        score += 15;
        reasons.push(`✓ Soil pH (${userPh}) falls in optimal range (${crop.phRange.min} - ${crop.phRange.max})`);
      } else {
        score += 5;
        whyNot.push(`✕ Soil pH (${userPh}) deviates from crop preference (${crop.phRange.min} - ${crop.phRange.max})`);
      }
    } else {
      score += 10;
    }

    // 5. Regional Location (+10 pts)
    const userState = input.location?.state;
    if (userState && crop.majorRegions.some((reg) => reg.toLowerCase().includes(userState.toLowerCase()))) {
      score += 10;
      reasons.push(`✓ Suitable for ${userState} regional growing zone`);
    } else {
      score += 5;
    }

    // 6. Crop Rotation / Previous Crop (+10 pts)
    const prev = input.previousCrop?.toLowerCase();
    if (prev) {
      const isPulse = prev.includes('gram') || prev.includes('soybean') || prev.includes('chickpea') || prev.includes('tur') || prev.includes('arhar');
      const isCereal = prev.includes('wheat') || prev.includes('rice') || prev.includes('maize');

      if (isPulse && (crop.id === 'wheat' || crop.id === 'maize' || crop.id === 'rice')) {
        score += 10;
        reasons.push(`✓ Ideal crop rotation after previous legume/pulse crop (${input.previousCrop})`);
      } else if (isCereal && (crop.id === 'chickpea' || crop.id === 'soybean' || crop.id === 'pigeon-pea')) {
        score += 10;
        reasons.push(`✓ Restores soil nitrogen balance after previous cereal crop (${input.previousCrop})`);
      }
    }

    // Integer rounded score strictly bounded between 40% and 94%
    const finalScore = Math.max(40, Math.min(94, Math.round(score)));

    return {
      crop: `${crop.cropName} (${crop.hindiName})`,
      hindiName: crop.hindiName,
      scientificName: crop.scientificName,
      suitability: finalScore,
      reasons,
      whyNot,
      waterRequirement: crop.waterRequirement,
      suitableSeasons: crop.suitableSeasons,
      preferredSoilTypes: crop.preferredSoilTypes,
      detailsUrl: `/app/crop-recommendation/${crop.id}`,
    };
  });

  scoredCrops.sort((a, b) => b.suitability - a.suitability);

  return {
    season: input.season,
    engineType: 'Initial rule-based recommendation',
    disclaimer:
      'This recommendation is informational and should be considered along with local agricultural guidance, current weather, water availability and market conditions.',
    recommendations: scoredCrops,
  };
};

export const saveCropRecommendationSession = (
  input: CropRecommendationInput,
  recommendations: RankedCropResult[]
): SavedCropRecommendation => {
  const now = new Date().toISOString();
  const id = `rec_${Date.now()}`;
  const record: SavedCropRecommendation = {
    id,
    farmerId: 'farmer_local',
    farmId: 'farm_local',
    season: input.season,
    inputSnapshot: input,
    recommendations,
    engineType: 'Initial rule-based recommendation',
    disclaimer:
      'This recommendation is informational and should be considered along with local agricultural guidance, current weather, water availability and market conditions.',
    createdAt: now,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getRecommendationHistory();
      const updated = [record, ...existing];
      localStorage.setItem(RECOMMENDATION_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recommendation history to localStorage', e);
    }
  }

  // Attempt backend API call
  try {
    fetch('http://localhost:5000/api/v1/crop-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  } catch (err) {}

  return record;
};

export const getRecommendationHistory = (): SavedCropRecommendation[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RECOMMENDATION_HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedCropRecommendation[];
  } catch (e) {
    return [];
  }
};
