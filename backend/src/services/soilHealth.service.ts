export interface ParameterEvaluationInput {
  value?: number;
  unit?: string;
  source?: string;
}

export interface SoilHealthInput {
  ph: number;
  nitrogen?: ParameterEvaluationInput;
  phosphorus?: ParameterEvaluationInput;
  potassium?: ParameterEvaluationInput;
  organicCarbon?: ParameterEvaluationInput;
  electricalConductivity?: ParameterEvaluationInput;
  sulfur?: ParameterEvaluationInput;
  zinc?: ParameterEvaluationInput;
  iron?: ParameterEvaluationInput;
  copper?: ParameterEvaluationInput;
  manganese?: ParameterEvaluationInput;
  boron?: ParameterEvaluationInput;
  soilType?: string;
  irrigationType?: string;
  crop?: string;
}

export interface SoilParameterEvaluation {
  parameter: string;
  code: string;
  value: number;
  unit: string;
  status: 'OPTIMAL' | 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'DEFICIENT' | 'NEEDS ATTENTION' | 'RECORDED';
  benchmark: string;
  category: 'pH' | 'Primary' | 'Secondary' | 'Micronutrient' | 'Organic' | 'Salinity';
  explanation: string;
  managementGuidance?: string;
  isAvailable: boolean;
}

export interface SoilPositionSummary {
  overallStatus: 'GOOD' | 'NEEDS ATTENTION' | 'SIGNIFICANT DEFICIENCIES DETECTED';
  overallStatusTitle: string;
  summaryExplanation: string;
  attentionCount: number;
  optimalCount: number;
  totalEvaluated: number;
  parameters: SoilParameterEvaluation[];
  practicalGuidance: string[];
}

export class SoilHealthService {
  /**
   * Scientifically evaluate soil parameters according to Indian ICAR / SHC norms
   */
  public static interpretSoilHealth(input: SoilHealthInput): SoilPositionSummary {
    const parameters: SoilParameterEvaluation[] = [];
    const practicalGuidance: string[] = [];
    const attentionItems: string[] = [];
    const normalItems: string[] = [];

    // 1. pH Interpretation
    const phVal = input.ph;
    let phStatus: SoilParameterEvaluation['status'] = 'NORMAL';
    let phExp = 'Shows how acidic or alkaline the soil is. Ideal range (6.0 - 7.5) for nutrient absorption.';
    let phGuidance = '';

    if (phVal < 6.0) {
      phStatus = 'LOW';
      phExp = 'Acidic soil reaction. Can limit root availability of phosphorus, calcium, and magnesium.';
      phGuidance = 'Consider applying agricultural lime (calcium carbonate) or dolomite based on local soil test lab recommendation.';
      attentionItems.push(`soil is acidic (pH ${phVal})`);
      practicalGuidance.push(phGuidance);
    } else if (phVal > 7.8) {
      phStatus = 'HIGH';
      phExp = 'Alkaline soil reaction. High pH may bind critical micronutrients like Zinc, Iron, and Manganese.';
      phGuidance = 'Apply agricultural gypsum or increase well-decomposed organic compost to help moderate soil alkalinity.';
      attentionItems.push(`soil is alkaline (pH ${phVal})`);
      practicalGuidance.push(phGuidance);
    } else {
      phStatus = 'OPTIMAL';
      normalItems.push(`pH (${phVal}) is optimal`);
    }

    parameters.push({
      parameter: 'Soil Reaction (pH)',
      code: 'ph',
      value: phVal,
      unit: '',
      status: phStatus,
      benchmark: '6.0 - 7.5',
      category: 'pH',
      explanation: phExp,
      managementGuidance: phGuidance || 'Maintain current organic matter practices to keep soil reaction balanced.',
      isAvailable: true,
    });

    // 2. Organic Carbon (OC) in %
    if (input.organicCarbon && typeof input.organicCarbon.value === 'number') {
      const oc = input.organicCarbon.value;
      const unit = input.organicCarbon.unit || '%';
      let ocStatus: SoilParameterEvaluation['status'] = 'MEDIUM';
      let ocExp = 'Measures soil organic matter, microbial activity, and moisture retention capacity.';
      let ocGuidance = '';

      if (oc < 0.50) {
        ocStatus = 'LOW';
        ocExp = 'Low organic carbon reduces water-holding capacity and microbial nutrient cycling.';
        ocGuidance = 'Incorporate 5-10 tonnes/ha Farmyard Manure (FYM), vermicompost, or green manuring with Sesbania (Dhaincha) / Sunhemp.';
        attentionItems.push(`low organic carbon (${oc}%)`);
        practicalGuidance.push(ocGuidance);
      } else if (oc > 0.75) {
        ocStatus = 'OPTIMAL';
        ocExp = 'High organic carbon supporting vigorous microbial activity and soil crumb structure.';
        normalItems.push(`organic carbon (${oc}%) is optimal`);
      } else {
        ocStatus = 'MEDIUM';
        ocExp = 'Moderate organic carbon status. Satisfactory baseline for crop growth.';
        normalItems.push(`organic carbon (${oc}%) is medium`);
      }

      parameters.push({
        parameter: 'Organic Carbon (OC)',
        code: 'oc',
        value: oc,
        unit,
        status: ocStatus,
        benchmark: '> 0.75 % (High)',
        category: 'Organic',
        explanation: ocExp,
        managementGuidance: ocGuidance || 'Continue regular additions of crop residue and organic amendments.',
        isAvailable: true,
      });
    }

    // 3. Available Nitrogen (N) in kg/ha
    if (input.nitrogen && typeof input.nitrogen.value === 'number') {
      const n = input.nitrogen.value;
      const unit = input.nitrogen.unit || 'kg/ha';
      let nStatus: SoilParameterEvaluation['status'] = 'MEDIUM';
      let nExp = 'Drives vegetative plant growth, tillering, and leaf chlorophyll development.';
      let nGuidance = '';

      if (n < 280) {
        nStatus = 'LOW';
        nExp = 'Below reference range (< 280 kg/ha). Nitrogen shortage can slow vegetative canopy establishment.';
        nGuidance = 'Plan split nitrogen applications (e.g. neem-coated urea at sowing, tillering, and panicle initiation) or intercrop with pulses.';
        attentionItems.push(`low available nitrogen (${n} kg/ha)`);
        practicalGuidance.push(nGuidance);
      } else if (n > 560) {
        nStatus = 'HIGH';
        nExp = 'Abundant available Nitrogen (> 560 kg/ha). Ample reserves for crop growth.';
        normalItems.push(`nitrogen (${n} kg/ha) is high`);
      } else {
        nStatus = 'MEDIUM';
        nExp = 'Adequate available Nitrogen (280 - 560 kg/ha) for balanced vegetative development.';
        normalItems.push(`nitrogen (${n} kg/ha) is medium`);
      }

      parameters.push({
        parameter: 'Available Nitrogen (N)',
        code: 'n',
        value: n,
        unit,
        status: nStatus,
        benchmark: '280 - 560 kg/ha',
        category: 'Primary',
        explanation: nExp,
        managementGuidance: nGuidance || 'Apply recommended split doses of nitrogen matched to crop stage.',
        isAvailable: true,
      });
    }

    // 4. Available Phosphorus (P) in kg/ha
    if (input.phosphorus && typeof input.phosphorus.value === 'number') {
      const p = input.phosphorus.value;
      const unit = input.phosphorus.unit || 'kg/ha';
      let pStatus: SoilParameterEvaluation['status'] = 'MEDIUM';
      let pExp = 'Essential for root proliferation, early seedling vigor, flowering, and grain filling.';
      let pGuidance = '';

      if (p < 10) {
        pStatus = 'LOW';
        pExp = 'Below reference range (< 10 kg/ha). Can delay root establishment and flowering.';
        pGuidance = 'Apply basal Single Super Phosphate (SSP) or DAP placed 3-5 cm below seed level during sowing.';
        attentionItems.push(`low phosphorus (${p} kg/ha)`);
        practicalGuidance.push(pGuidance);
      } else if (p > 25) {
        pStatus = 'HIGH';
        pExp = 'High phosphorus reserve (> 25 kg/ha). Promotes strong root network.';
        normalItems.push(`phosphorus (${p} kg/ha) is high`);
      } else {
        pStatus = 'MEDIUM';
        pExp = 'Moderate phosphorus status (10 - 25 kg/ha).';
        normalItems.push(`phosphorus (${p} kg/ha) is medium`);
      }

      parameters.push({
        parameter: 'Available Phosphorus (P)',
        code: 'p',
        value: p,
        unit,
        status: pStatus,
        benchmark: '10 - 25 kg/ha',
        category: 'Primary',
        explanation: pExp,
        managementGuidance: pGuidance || 'Maintain balanced basal phosphorus fertilization.',
        isAvailable: true,
      });
    }

    // 5. Available Potassium (K) in kg/ha
    if (input.potassium && typeof input.potassium.value === 'number') {
      const k = input.potassium.value;
      const unit = input.potassium.unit || 'kg/ha';
      let kStatus: SoilParameterEvaluation['status'] = 'MEDIUM';
      let kExp = 'Improves drought resilience, stem strength, pest resistance, and grain quality.';
      let kGuidance = '';

      if (k < 108) {
        kStatus = 'LOW';
        kExp = 'Below reference range (< 108 kg/ha). Can reduce crop resistance to environmental stress and lodging.';
        kGuidance = 'Apply Muriate of Potash (MOP / 0-0-60) at basal sowing or early vegetative stage.';
        attentionItems.push(`low potassium (${k} kg/ha)`);
        practicalGuidance.push(kGuidance);
      } else if (k > 280) {
        kStatus = 'HIGH';
        kExp = 'High potassium reserve (> 280 kg/ha). Supports excellent drought tolerance and grain weight.';
        normalItems.push(`potassium (${k} kg/ha) is high`);
      } else {
        kStatus = 'MEDIUM';
        kExp = 'Satisfactory potassium status (108 - 280 kg/ha).';
        normalItems.push(`potassium (${k} kg/ha) is medium`);
      }

      parameters.push({
        parameter: 'Available Potassium (K)',
        code: 'k',
        value: k,
        unit,
        status: kStatus,
        benchmark: '108 - 280 kg/ha',
        category: 'Primary',
        explanation: kExp,
        managementGuidance: kGuidance || 'Continue standard potash replenishment according to crop removal rates.',
        isAvailable: true,
      });
    }

    // 6. Electrical Conductivity (EC) in dS/m
    if (input.electricalConductivity && typeof input.electricalConductivity.value === 'number') {
      const ec = input.electricalConductivity.value;
      const unit = input.electricalConductivity.unit || 'dS/m';
      let ecStatus: SoilParameterEvaluation['status'] = 'NORMAL';
      let ecExp = 'Measures concentration of soluble salts in soil water solution.';
      let ecGuidance = '';

      if (ec > 2.0) {
        ecStatus = 'HIGH';
        ecExp = 'High electrical conductivity indicating potential soil salinity stress on sensitive roots.';
        ecGuidance = 'Ensure deep field drainage and irrigate with low-salinity water to leach excess soluble salts.';
        attentionItems.push(`elevated salinity (EC ${ec} dS/m)`);
        practicalGuidance.push(ecGuidance);
      } else {
        ecStatus = 'NORMAL';
        normalItems.push(`salinity (EC ${ec} dS/m) is normal`);
      }

      parameters.push({
        parameter: 'Electrical Conductivity (EC)',
        code: 'ec',
        value: ec,
        unit,
        status: ecStatus,
        benchmark: '< 1.0 dS/m (Normal)',
        category: 'Salinity',
        explanation: ecExp,
        managementGuidance: ecGuidance || 'Soluble salt level is safe for field crops.',
        isAvailable: true,
      });
    }

    // 7. Sulphur (S) in ppm
    if (input.sulfur && typeof input.sulfur.value === 'number') {
      const s = input.sulfur.value;
      let sStatus: SoilParameterEvaluation['status'] = 'NORMAL';
      let sGuidance = '';
      if (s < 10.0) {
        sStatus = 'DEFICIENT';
        sGuidance = 'Apply gypsum or elemental sulphur (20-25 kg/ha) especially before oilseed or pulse crops.';
        attentionItems.push(`sulphur deficient (${s} ppm)`);
        practicalGuidance.push(sGuidance);
      } else {
        sStatus = 'OPTIMAL';
        normalItems.push(`sulphur (${s} ppm) is sufficient`);
      }
      parameters.push({
        parameter: 'Available Sulphur (S)',
        code: 's',
        value: s,
        unit: 'ppm',
        status: sStatus,
        benchmark: '>= 10.0 ppm',
        category: 'Secondary',
        explanation: 'Crucial for oil synthesis in oilseeds and protein synthesis in pulses.',
        managementGuidance: sGuidance || 'Sulphur level is adequate.',
        isAvailable: true,
      });
    }

    // 8. Zinc (Zn) in ppm
    if (input.zinc && typeof input.zinc.value === 'number') {
      const zn = input.zinc.value;
      let znStatus: SoilParameterEvaluation['status'] = 'NORMAL';
      let znGuidance = '';
      if (zn < 0.60) {
        znStatus = 'DEFICIENT';
        znGuidance = 'Apply Zinc Sulphate (20-25 kg/ha ZnSO4) as soil basal dressing or foliar spray (0.5%) for standing crop.';
        attentionItems.push(`zinc deficient (${zn} ppm)`);
        practicalGuidance.push(znGuidance);
      } else {
        znStatus = 'OPTIMAL';
        normalItems.push(`zinc (${zn} ppm) is sufficient`);
      }
      parameters.push({
        parameter: 'Available Zinc (Zn)',
        code: 'zn',
        value: zn,
        unit: 'ppm',
        status: znStatus,
        benchmark: '>= 0.60 ppm',
        category: 'Micronutrient',
        explanation: 'Essential enzyme activator; deficiency causes Khaira disease in paddy and leaf bronzing.',
        managementGuidance: znGuidance || 'Zinc level is sufficient.',
        isAvailable: true,
      });
    }

    // 9. Iron (Fe) in ppm
    if (input.iron && typeof input.iron.value === 'number') {
      const fe = input.iron.value;
      let feStatus: SoilParameterEvaluation['status'] = 'NORMAL';
      let feGuidance = '';
      if (fe < 4.5) {
        feStatus = 'DEFICIENT';
        feGuidance = 'Apply Ferrous Sulphate (FeSO4) or foliar spray with 1% FeSO4 + 0.1% citric acid.';
        attentionItems.push(`iron deficient (${fe} ppm)`);
        practicalGuidance.push(feGuidance);
      } else {
        feStatus = 'OPTIMAL';
        normalItems.push(`iron (${fe} ppm) is sufficient`);
      }
      parameters.push({
        parameter: 'Available Iron (Fe)',
        code: 'fe',
        value: fe,
        unit: 'ppm',
        status: feStatus,
        benchmark: '>= 4.5 ppm',
        category: 'Micronutrient',
        explanation: 'Essential for chlorophyll synthesis and electron transport in plant respiration.',
        managementGuidance: feGuidance || 'Iron level is sufficient.',
        isAvailable: true,
      });
    }

    // Overall Status Computation
    const attentionCount = parameters.filter((p) =>
      ['LOW', 'HIGH', 'DEFICIENT', 'NEEDS ATTENTION'].includes(p.status)
    ).length;
    const optimalCount = parameters.filter((p) => ['OPTIMAL', 'NORMAL', 'MEDIUM'].includes(p.status)).length;
    const totalEvaluated = parameters.length;

    let overallStatus: SoilPositionSummary['overallStatus'] = 'GOOD';
    let overallStatusTitle = 'Good Soil Position';

    if (attentionCount >= 3) {
      overallStatus = 'SIGNIFICANT DEFICIENCIES DETECTED';
      overallStatusTitle = 'Significant Deficiencies Detected';
    } else if (attentionCount >= 1) {
      overallStatus = 'NEEDS ATTENTION';
      overallStatusTitle = 'Needs Attention';
    } else {
      overallStatus = 'GOOD';
      overallStatusTitle = 'Good Soil Position';
    }

    // Transparent reasoning
    let summaryExplanation = '';
    if (attentionItems.length > 0) {
      summaryExplanation = `Your latest soil report indicates ${attentionItems.join(', ')}, while ${
        normalItems.length > 0 ? normalItems.slice(0, 3).join(', ') : 'other parameters'
      } are within the reference range.`;
    } else {
      summaryExplanation = `All measured primary and micronutrient levels are balanced and fall within the recommended agronomic reference ranges for your crop.`;
    }

    return {
      overallStatus,
      overallStatusTitle,
      summaryExplanation,
      attentionCount,
      optimalCount,
      totalEvaluated,
      parameters,
      practicalGuidance: Array.from(new Set(practicalGuidance)),
    };
  }
}
