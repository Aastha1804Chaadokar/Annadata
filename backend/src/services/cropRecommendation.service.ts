import { CROP_KNOWLEDGE_BASE, CropKnowledgeItem } from '../data/cropKnowledge.js';

export interface RecommendationRequestInput {
  season: 'Kharif' | 'Rabi' | 'Zaid';
  irrigation: 'Rain-fed' | 'Borewell' | 'Canal' | 'Drip' | 'Other';
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

export interface RankedCropOutput {
  crop: string;
  hindiName: string;
  scientificName: string;
  suitability: number; // Rounded integer percentage
  reasons: string[];
  whyNot: string[];
  waterRequirement: string;
  suitableSeasons: string[];
  preferredSoilTypes: string[];
  detailsUrl?: string;
}

export interface RecommendationResponse {
  season: string;
  engineType: string;
  disclaimer: string;
  recommendations: RankedCropOutput[];
}

export class CropRecommendationService {
  /**
   * Evaluates crops from knowledge base using a transparent rule engine.
   */
  public static generateRecommendations(input: RecommendationRequestInput): RecommendationResponse {
    const scoredCrops: RankedCropOutput[] = CROP_KNOWLEDGE_BASE.map((crop) => {
      let score = 50; // Base baseline score
      const reasons: string[] = [];
      const whyNot: string[] = [];

      // 1. Season Evaluation (Max +30 points)
      if (crop.suitableSeasons.includes(input.season)) {
        score += 30;
        reasons.push(`✓ Suitable for ${input.season} growing season`);
      } else {
        score -= 25;
        whyNot.push(`✕ Primary season is ${crop.suitableSeasons.join(', ')} rather than ${input.season}`);
      }

      // 2. Water Availability & Irrigation Evaluation (Max +20 points)
      const userIrrigation = input.irrigation || 'Rain-fed';
      if (userIrrigation === 'Rain-fed') {
        if (crop.waterRequirement === 'Low') {
          score += 20;
          reasons.push('✓ Excellent match for rain-fed dryland fields');
        } else if (crop.waterRequirement === 'Medium') {
          score += 10;
          reasons.push('✓ Compatible with rain-fed monsoon water availability');
        } else {
          score -= 15;
          whyNot.push(`✕ High water requirement crop requires assured irrigation (Canal/Borewell)`);
        }
      } else {
        // Borewell, Canal, Drip
        if (crop.waterRequirement === 'High' || crop.waterRequirement === 'Medium') {
          score += 20;
          reasons.push(`✓ Assured water support from ${userIrrigation} irrigation`);
        } else {
          score += 15;
          reasons.push(`✓ Low water requirement crop conserves groundwater under ${userIrrigation}`);
        }
      }

      // 3. Soil Type Evaluation (Max +15 points)
      const userSoilType = input.soil?.soilType;
      if (userSoilType && userSoilType !== 'Unknown' && userSoilType !== "I don't know") {
        if (crop.preferredSoilTypes.includes(userSoilType) || crop.preferredSoilTypes.includes('All')) {
          score += 15;
          reasons.push(`✓ Soil type (${userSoilType}) is well-suited for root establishment`);
        } else {
          score += 5;
          whyNot.push(`✕ Prefers ${crop.preferredSoilTypes.join(' or ')} soil over ${userSoilType}`);
        }
      } else {
        score += 10; // Neutral credit if soil type unknown
        reasons.push('✓ Broadly adaptable across typical regional soil types');
      }

      // 4. pH Compatibility (Max +15 points)
      const userPh = input.soil?.ph;
      if (typeof userPh === 'number' && userPh > 0) {
        if (userPh >= crop.phRange.min && userPh <= crop.phRange.max) {
          score += 15;
          reasons.push(`✓ Soil pH (${userPh}) falls in optimal range (${crop.phRange.min} - ${crop.phRange.max})`);
        } else if (Math.abs(userPh - crop.phRange.min) <= 0.8 || Math.abs(userPh - crop.phRange.max) <= 0.8) {
          score += 8;
          whyNot.push(`✕ Soil pH (${userPh}) slightly outside ideal range (${crop.phRange.min} - ${crop.phRange.max})`);
        } else {
          score -= 10;
          whyNot.push(`✕ Soil pH (${userPh}) deviates from crop preference (${crop.phRange.min} - ${crop.phRange.max})`);
        }
      } else {
        score += 10; // Neutral credit if pH not provided
      }

      // 5. Regional Location Match (Max +10 points)
      const userState = input.location?.state;
      if (userState && crop.majorRegions.some((reg) => reg.toLowerCase().includes(userState.toLowerCase()))) {
        score += 10;
        reasons.push(`✓ Traditional high-yield crop for ${userState} agro-climatic region`);
      } else {
        score += 5;
      }

      // 6. Crop Rotation / Previous Crop (Max +10 points)
      const prev = input.previousCrop?.toLowerCase();
      if (prev) {
        // Legume -> Cereal or Cereal -> Legume rotation bonus
        const isPulseOrLegume = prev.includes('gram') || prev.includes('soybean') || prev.includes('chickpea') || prev.includes('tur') || prev.includes('arhar');
        const isCereal = prev.includes('wheat') || prev.includes('rice') || prev.includes('maize');

        if (isPulseOrLegume && (crop.id === 'wheat' || crop.id === 'maize' || crop.id === 'rice')) {
          score += 10;
          reasons.push(`✓ Excellent rotation after previous pulse/legume crop (${input.previousCrop})`);
        } else if (isCereal && (crop.id === 'chickpea' || crop.id === 'soybean' || crop.id === 'pigeon-pea')) {
          score += 10;
          reasons.push(`✓ Restores soil nitrogen after previous cereal crop (${input.previousCrop})`);
        }
      }

      // Ensure rounded integer score bounded strictly between 40% and 94%
      const finalSuitability = Math.max(40, Math.min(94, Math.round(score)));

      return {
        crop: `${crop.cropName} (${crop.hindiName})`,
        hindiName: crop.hindiName,
        scientificName: crop.scientificName,
        suitability: finalSuitability,
        reasons,
        whyNot,
        waterRequirement: crop.waterRequirement,
        suitableSeasons: crop.suitableSeasons,
        preferredSoilTypes: crop.preferredSoilTypes,
        detailsUrl: `/app/crop-recommendation/${crop.id}`,
      };
    });

    // Rank crops descending by suitability score
    scoredCrops.sort((a, b) => b.suitability - a.suitability);

    return {
      season: input.season,
      engineType: 'Initial rule-based recommendation',
      disclaimer:
        'This recommendation is informational and should be considered along with local agricultural guidance, current weather, water availability and market conditions.',
      recommendations: scoredCrops,
    };
  }
}
