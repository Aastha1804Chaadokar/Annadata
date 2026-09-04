export interface SoilValueInput {
  ph: number;
  nitrogen: { value: number; unit: string };
  phosphorus: { value: number; unit: string };
  potassium: { value: number; unit: string };
  organicCarbon: { value: number; unit: string };
  electricalConductivity?: { value?: number; unit?: string };
  soilType?: string;
  irrigationType?: string;
}

export interface SoilParameterResult {
  parameter: string;
  value: number;
  unit: string;
  status: string;
  explanation: string;
  category: 'pH' | 'Nutrient' | 'Organic' | 'Salinity';
}

export interface SoilInterpretationSummary {
  overallHealth: string;
  parameters: SoilParameterResult[];
  recommendations: string[];
}

export class SoilHealthService {
  /**
   * Interpret soil values scientifically without hardcoding logic in frontend components.
   */
  public static interpretSoilHealth(input: SoilValueInput): SoilInterpretationSummary {
    const results: SoilParameterResult[] = [];
    const recommendations: string[] = [];

    // 1. pH Interpretation
    const phVal = input.ph;
    let phStatus = 'Suitable';
    let phExp = 'Shows how acidic or alkaline the soil is. Your pH is in an optimal range for most Indian field crops.';

    if (phVal < 6.0) {
      phStatus = 'Acidic';
      phExp = 'Shows how acidic or alkaline the soil is. Acidic soil can reduce key nutrient availability for crops.';
      recommendations.push('Consider applying agricultural lime to balance acidic soil pH.');
    } else if (phVal > 7.8) {
      phStatus = 'Alkaline';
      phExp = 'Shows how acidic or alkaline the soil is. High alkalinity may lock micronutrients like Zinc and Iron.';
      recommendations.push('Consider applying gypsum or organic compost to lower soil alkalinity.');
    } else {
      phStatus = 'Suitable';
      phExp = 'Shows how acidic or alkaline the soil is. Ideal range (6.0 - 7.5) for nutrient absorption.';
    }

    results.push({
      parameter: 'pH',
      value: phVal,
      unit: '',
      status: phStatus,
      explanation: phExp,
      category: 'pH',
    });

    // 2. Nitrogen (N) Interpretation
    // Standard SHC benchmark for N: < 280 kg/ha = Low, 280 - 560 kg/ha = Medium, > 560 kg/ha = High
    const nVal = input.nitrogen.value;
    const nUnit = input.nitrogen.unit || 'kg/ha';
    let nStatus = 'Medium';
    let nExp = 'Important for plant growth and leaf development.';

    if (nUnit.toLowerCase() === 'kg/ha') {
      if (nVal < 280) {
        nStatus = 'Low';
        nExp = 'Important for plant growth and leaf development. Your soil is low in available Nitrogen.';
        recommendations.push('Incorporate leguminous cover crops or split urea / organic compost applications.');
      } else if (nVal > 560) {
        nStatus = 'High';
        nExp = 'Important for plant growth and leaf development. Ample Nitrogen present.';
      } else {
        nStatus = 'Medium';
        nExp = 'Important for plant growth and leaf development. Adequate Nitrogen level for normal vegetative growth.';
      }
    } else {
      nStatus = 'Recorded';
      nExp = `Nitrogen recorded at ${nVal} ${nUnit}. Unit requires standardized SHC conversion.`;
    }

    results.push({
      parameter: 'Nitrogen (N)',
      value: nVal,
      unit: nUnit,
      status: nStatus,
      explanation: nExp,
      category: 'Nutrient',
    });

    // 3. Phosphorus (P) Interpretation
    // Benchmark P: < 10 kg/ha (or < 23 P2O5) = Low, 10 - 25 = Medium, > 25 = High
    const pVal = input.phosphorus.value;
    const pUnit = input.phosphorus.unit || 'kg/ha';
    let pStatus = 'Medium';
    let pExp = 'Helps root development, flowering, and seed formation.';

    if (pUnit.toLowerCase() === 'kg/ha') {
      if (pVal < 11) {
        pStatus = 'Low';
        pExp = 'Helps root development and seed formation. Low Phosphorus can slow root establishment.';
        recommendations.push('Apply Single Super Phosphate (SSP) or DAP at sowing time near root zone.');
      } else if (pVal > 25) {
        pStatus = 'High';
        pExp = 'Helps root development and seed formation. Excellent available Phosphorus status.';
      } else {
        pStatus = 'Medium';
        pExp = 'Helps root development and seed formation. Moderate Phosphorus level.';
      }
    } else {
      pStatus = 'Recorded';
      pExp = `Phosphorus recorded at ${pVal} ${pUnit}.`;
    }

    results.push({
      parameter: 'Phosphorus (P)',
      value: pVal,
      unit: pUnit,
      status: pStatus,
      explanation: pExp,
      category: 'Nutrient',
    });

    // 4. Potassium (K) Interpretation
    // Benchmark K: < 108 kg/ha = Low, 108 - 280 = Medium, > 280 = High
    const kVal = input.potassium.value;
    const kUnit = input.potassium.unit || 'kg/ha';
    let kStatus = 'Medium';
    let kExp = 'Improves disease resistance, grain weight, and drought tolerance.';

    if (kUnit.toLowerCase() === 'kg/ha') {
      if (kVal < 110) {
        kStatus = 'Low';
        kExp = 'Improves disease resistance and drought tolerance. Low Potassium can make crops susceptible to stress.';
        recommendations.push('Apply Muriate of Potash (MOP) to boost crop stamina and pest resilience.');
      } else if (kVal > 280) {
        kStatus = 'High';
        kExp = 'Improves disease resistance and grain quality. High Potassium status.';
      } else {
        kStatus = 'Medium';
        kExp = 'Improves disease resistance and drought tolerance. Good Potassium balance.';
      }
    } else {
      kStatus = 'Recorded';
      pExp = `Potassium recorded at ${kVal} ${kUnit}.`;
    }

    results.push({
      parameter: 'Potassium (K)',
      value: kVal,
      unit: kUnit,
      status: kStatus,
      explanation: kExp,
      category: 'Nutrient',
    });

    // 5. Organic Carbon (OC) Interpretation
    // Benchmark OC (%): < 0.5% = Low, 0.5% - 0.75% = Medium, > 0.75% = High / Optimal
    const ocVal = input.organicCarbon.value;
    const ocUnit = input.organicCarbon.unit || '%';
    let ocStatus = 'Medium';
    let ocExp = 'Measures soil organic matter, microbial activity, and moisture retention capacity.';

    if (ocVal < 0.5) {
      ocStatus = 'Low';
      ocExp = 'Measures soil organic matter. Low organic carbon reduces soil water holding capacity.';
      recommendations.push('Add farmyard manure (FYM), vermicompost, or practice green manuring (Dhaincha/Sunhemp).');
    } else if (ocVal > 0.75) {
      ocStatus = 'Optimal';
      ocExp = 'Measures soil organic matter. Excellent organic carbon levels promoting healthy soil biology.';
    } else {
      ocStatus = 'Medium';
      ocExp = 'Measures soil organic matter. Satisfactory organic carbon content.';
    }

    results.push({
      parameter: 'Organic Carbon (OC)',
      value: ocVal,
      unit: ocUnit,
      status: ocStatus,
      explanation: ocExp,
      category: 'Organic',
    });

    // 6. Electrical Conductivity (EC) if present
    if (input.electricalConductivity && typeof input.electricalConductivity.value === 'number') {
      const ecVal = input.electricalConductivity.value;
      const ecUnit = input.electricalConductivity.unit || 'dS/m';
      let ecStatus = 'Normal';
      let ecExp = 'Measures total soluble salts in soil.';

      if (ecVal > 2.0) {
        ecStatus = 'High Salinity';
        ecExp = 'Measures soluble salt content. High salinity can cause salt stress in sensitive crops.';
        recommendations.push('Ensure good field drainage and flush excess salts with fresh irrigation water.');
      } else {
        ecStatus = 'Normal';
        ecExp = 'Measures soluble salts. Soluble salt level is safe for crop roots.';
      }

      results.push({
        parameter: 'Electrical Conductivity (EC)',
        value: ecVal,
        unit: ecUnit,
        status: ecStatus,
        explanation: ecExp,
        category: 'Salinity',
      });
    }

    // Overall Profile summary text
    let overall = 'Balanced Soil Profile';
    if (phStatus === 'Acidic' || phStatus === 'Alkaline' || nStatus === 'Low' || ocStatus === 'Low') {
      overall = 'Needs Nutrient Management';
    } else if (nStatus === 'Medium' && pStatus === 'Medium' && kStatus === 'Medium') {
      overall = 'Good Health Profile';
    } else if (ocStatus === 'Optimal' && phStatus === 'Suitable') {
      overall = 'Optimal Soil Health';
    }

    return {
      overallHealth: overall,
      parameters: results,
      recommendations,
    };
  }
}
