import { SoilReportInput, SoilReportRecord, SoilInterpretation, SoilParameterStatus } from '@/types/soil';
import { API_ENDPOINTS } from './apiConfig';

const SOIL_REPORTS_STORAGE_KEY = 'annadata_soil_reports';

export const interpretSoilParameters = (input: {
  ph: number;
  nitrogen: { value: number; unit: string };
  phosphorus: { value: number; unit: string };
  potassium: { value: number; unit: string };
  organicCarbon: { value: number; unit: string };
  electricalConductivity?: { value?: number; unit?: string };
}): SoilInterpretation => {
  const results: SoilParameterStatus[] = [];
  const recommendations: string[] = [];

  // pH
  const ph = input.ph;
  let phStatus = 'Suitable';
  let phExp = 'Shows how acidic or alkaline the soil is. Ideal range (6.0 - 7.5) for optimal root nutrient absorption.';
  if (ph < 6.0) {
    phStatus = 'Acidic';
    phExp = 'Shows how acidic or alkaline the soil is. Acidic soil reduces availability of phosphorus and calcium.';
    recommendations.push('Apply agricultural lime to neutralize acidic soil pH.');
  } else if (ph > 7.8) {
    phStatus = 'Alkaline';
    phExp = 'Shows how acidic or alkaline the soil is. High alkalinity locks micronutrients like Zinc and Iron.';
    recommendations.push('Apply organic compost or agricultural gypsum to lower pH.');
  }
  results.push({
    parameter: 'pH',
    value: ph,
    unit: '',
    status: phStatus,
    explanation: phExp,
    category: 'pH',
  });

  // Nitrogen (N)
  const nVal = input.nitrogen.value;
  const nUnit = input.nitrogen.unit || 'kg/ha';
  let nStatus = 'Medium';
  let nExp = 'Important for plant growth and leaf development.';
  if (nUnit.toLowerCase() === 'kg/ha') {
    if (nVal < 280) {
      nStatus = 'Low';
      nExp = 'Important for plant growth and leaf development. Your field requires nitrogen reinforcement.';
      recommendations.push('Incorporate neem-coated urea in splits or apply composted manure.');
    } else if (nVal > 560) {
      nStatus = 'High';
      nExp = 'Important for plant growth and leaf development. High available Nitrogen status.';
    } else {
      nStatus = 'Medium';
      nExp = 'Important for plant growth and leaf development. Adequate Nitrogen balance for general crops.';
    }
  } else {
    nStatus = 'Recorded';
    nExp = `Nitrogen recorded at ${nVal} ${nUnit}.`;
  }
  results.push({
    parameter: 'Nitrogen (N)',
    value: nVal,
    unit: nUnit,
    status: nStatus,
    explanation: nExp,
    category: 'Nutrient',
  });

  // Phosphorus (P)
  const pVal = input.phosphorus.value;
  const pUnit = input.phosphorus.unit || 'kg/ha';
  let pStatus = 'Medium';
  let pExp = 'Helps root development, early vigor, and flower/seed formation.';
  if (pUnit.toLowerCase() === 'kg/ha') {
    if (pVal < 11) {
      pStatus = 'Low';
      pExp = 'Helps root development and seed formation. Low Phosphorus can stunt early crop vigor.';
      recommendations.push('Apply Single Super Phosphate (SSP) or DAP close to root zone during sowing.');
    } else if (pVal > 25) {
      pStatus = 'High';
      pExp = 'Helps root development and seed formation. Excellent available Phosphorus reserves.';
    } else {
      pStatus = 'Medium';
      pExp = 'Helps root development and seed formation. Good baseline Phosphorus level.';
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

  // Potassium (K)
  const kVal = input.potassium.value;
  const kUnit = input.potassium.unit || 'kg/ha';
  let kStatus = 'Medium';
  let kExp = 'Improves disease resistance, grain weight, and drought resilience.';
  if (kUnit.toLowerCase() === 'kg/ha') {
    if (kVal < 110) {
      kStatus = 'Low';
      kExp = 'Improves disease resistance and drought tolerance. Low Potassium increases pest susceptibility.';
      recommendations.push('Apply Muriate of Potash (MOP) to build crop stamina.');
    } else if (kVal > 280) {
      kStatus = 'High';
      kExp = 'Improves disease resistance and drought tolerance. High available Potassium.';
    } else {
      kStatus = 'Medium';
      kExp = 'Improves disease resistance and drought tolerance. Satisfactory Potassium balance.';
    }
  } else {
    kStatus = 'Recorded';
    kExp = `Potassium recorded at ${kVal} ${kUnit}.`;
  }
  results.push({
    parameter: 'Potassium (K)',
    value: kVal,
    unit: kUnit,
    status: kStatus,
    explanation: kExp,
    category: 'Nutrient',
  });

  // Organic Carbon (OC)
  const ocVal = input.organicCarbon.value;
  const ocUnit = input.organicCarbon.unit || '%';
  let ocStatus = 'Medium';
  let ocExp = 'Measures soil organic matter, microbial activity, and water retention capacity.';
  if (ocVal < 0.5) {
    ocStatus = 'Low';
    ocExp = 'Measures soil organic matter. Low organic carbon lowers moisture holding capacity.';
    recommendations.push('Add well-decomposed Farm Yard Manure (FYM) or practice green manuring.');
  } else if (ocVal > 0.75) {
    ocStatus = 'Optimal';
    ocExp = 'Measures soil organic matter. High organic matter content supporting rich soil biology.';
  } else {
    ocStatus = 'Medium';
    ocExp = 'Measures soil organic matter. Satisfactory organic carbon status.';
  }
  results.push({
    parameter: 'Organic Carbon (OC)',
    value: ocVal,
    unit: ocUnit,
    status: ocStatus,
    explanation: ocExp,
    category: 'Organic',
  });

  // EC if present
  if (input.electricalConductivity && typeof input.electricalConductivity.value === 'number') {
    const ecVal = input.electricalConductivity.value;
    const ecUnit = input.electricalConductivity.unit || 'dS/m';
    let ecStatus = 'Normal';
    let ecExp = 'Measures total soluble salts in soil.';
    if (ecVal > 2.0) {
      ecStatus = 'High Salinity';
      ecExp = 'Measures soluble salts. High salinity causes salt stress in sensitive crops.';
      recommendations.push('Ensure proper field drainage channels and flush excess salt with clean water.');
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

  let overall = 'Balanced Soil Health';
  if (phStatus === 'Acidic' || phStatus === 'Alkaline' || nStatus === 'Low' || ocStatus === 'Low') {
    overall = 'Needs Nutrient Management';
  } else if (ocStatus === 'Optimal' && phStatus === 'Suitable') {
    overall = 'Optimal Soil Health';
  }

  return {
    overallHealth: overall,
    parameters: results,
    recommendations,
  };
};

export const getSoilReports = (): SoilReportRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SOIL_REPORTS_STORAGE_KEY);
    if (!data) return [];
    const list: SoilReportRecord[] = JSON.parse(data);
    return list.map((item) => ({
      ...item,
      interpretation: interpretSoilParameters({
        ph: item.ph,
        nitrogen: item.nitrogen,
        phosphorus: item.phosphorus,
        potassium: item.potassium,
        organicCarbon: item.organicCarbon,
        electricalConductivity: item.electricalConductivity,
      }),
    }));
  } catch (e) {
    console.error('Error reading soil reports from localStorage', e);
    return [];
  }
};

export const getLatestSoilReport = (): SoilReportRecord | null => {
  const reports = getSoilReports();
  if (reports.length === 0) return null;
  return reports[0]; // sorted newest first
};

export const getSoilReportById = (id: string): SoilReportRecord | null => {
  const reports = getSoilReports();
  return reports.find((r) => r.id === id) || null;
};

export const saveSoilReport = async (input: SoilReportInput): Promise<SoilReportRecord> => {
  const now = new Date().toISOString();
  const id = `soil_${Date.now()}`;
  const farmerId = 'farmer_local';
  const farmId = 'farm_local';

  const newRecord: SoilReportRecord = {
    ...input,
    id,
    farmerId,
    farmId,
    createdAt: now,
    updatedAt: now,
    interpretation: interpretSoilParameters({
      ph: input.ph,
      nitrogen: input.nitrogen,
      phosphorus: input.phosphorus,
      potassium: input.potassium,
      organicCarbon: input.organicCarbon,
      electricalConductivity: input.electricalConductivity,
    }),
  };

  // Try API request in background
  try {
    fetch(API_ENDPOINTS.SOIL_REPORTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    }).catch(() => {
      // API not running or network offline, gracefully fall back to local storage
    });
  } catch (err) {
    // Ignore offline error
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = getSoilReports();
      const updated = [newRecord, ...existing];
      localStorage.setItem(SOIL_REPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save soil report to localStorage', e);
    }
  }

  return newRecord;
};

export const deleteSoilReport = (id: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSoilReports();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(SOIL_REPORTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete soil report', e);
  }
};
