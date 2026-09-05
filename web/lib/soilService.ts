import {
  SoilReportInput,
  SoilReportRecord,
  SoilPositionSummary,
  SoilParameterStatus,
  DocumentUploadExtractionResult,
  SoilTrendPoint,
} from '@/types/soil';
import { API_ENDPOINTS } from './apiConfig';

const SOIL_REPORTS_STORAGE_KEY = 'annadata_soil_reports';

/**
 * Client-side fallback soil interpretation based on ICAR / Indian Soil Health Card benchmarks
 */
export const interpretSoilParameters = (input: {
  ph: number;
  nitrogen?: { value?: number; unit?: string };
  phosphorus?: { value?: number; unit?: string };
  potassium?: { value?: number; unit?: string };
  organicCarbon?: { value?: number; unit?: string };
  electricalConductivity?: { value?: number; unit?: string };
  sulfur?: { value?: number; unit?: string };
  zinc?: { value?: number; unit?: string };
  iron?: { value?: number; unit?: string };
  copper?: { value?: number; unit?: string };
  manganese?: { value?: number; unit?: string };
  boron?: { value?: number; unit?: string };
}): SoilPositionSummary => {
  const parameters: SoilParameterStatus[] = [];
  const practicalGuidance: string[] = [];
  const attentionItems: string[] = [];
  const normalItems: string[] = [];

  // 1. pH
  const ph = input.ph;
  let phStatus: SoilParameterStatus['status'] = 'NORMAL';
  let phExp = 'Shows how acidic or alkaline the soil is. Ideal range (6.0 - 7.5) for optimal nutrient absorption.';
  let phGuidance = '';

  if (ph < 6.0) {
    phStatus = 'LOW';
    phExp = 'Acidic soil reaction. Acidic soil reduces availability of phosphorus and calcium.';
    phGuidance = 'Apply agricultural lime (calcium carbonate) to neutralize acidic soil reaction.';
    attentionItems.push(`soil is acidic (pH ${ph})`);
    practicalGuidance.push(phGuidance);
  } else if (ph > 7.8) {
    phStatus = 'HIGH';
    phExp = 'Alkaline soil reaction. High alkalinity locks micronutrients like Zinc and Iron.';
    phGuidance = 'Apply agricultural gypsum or increase organic compost to balance soil alkalinity.';
    attentionItems.push(`soil is alkaline (pH ${ph})`);
    practicalGuidance.push(phGuidance);
  } else {
    phStatus = 'OPTIMAL';
    normalItems.push(`pH (${ph}) is optimal`);
  }

  parameters.push({
    parameter: 'Soil Reaction (pH)',
    code: 'ph',
    value: ph,
    unit: '',
    status: phStatus,
    benchmark: '6.0 - 7.5',
    category: 'pH',
    explanation: phExp,
    managementGuidance: phGuidance || 'Maintain current balanced soil practices.',
    isAvailable: true,
  });

  // 2. Organic Carbon (OC) in %
  if (input.organicCarbon && typeof input.organicCarbon.value === 'number') {
    const oc = input.organicCarbon.value;
    const unit = input.organicCarbon.unit || '%';
    let ocStatus: SoilParameterStatus['status'] = 'MEDIUM';
    let ocExp = 'Measures soil organic matter, microbial activity, and moisture retention capacity.';
    let ocGuidance = '';

    if (oc < 0.50) {
      ocStatus = 'LOW';
      ocExp = 'Low organic carbon reduces water-holding capacity and microbial activity.';
      ocGuidance = 'Add well-decomposed Farmyard Manure (FYM) or practice green manuring (Dhaincha/Sunhemp).';
      attentionItems.push(`low organic carbon (${oc}%)`);
      practicalGuidance.push(ocGuidance);
    } else if (oc > 0.75) {
      ocStatus = 'OPTIMAL';
      ocExp = 'High organic carbon content supporting rich soil biology.';
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
      managementGuidance: ocGuidance || 'Continue regular additions of organic compost.',
      isAvailable: true,
    });
  }

  // 3. Nitrogen (N) in kg/ha
  if (input.nitrogen && typeof input.nitrogen.value === 'number') {
    const n = input.nitrogen.value;
    const unit = input.nitrogen.unit || 'kg/ha';
    let nStatus: SoilParameterStatus['status'] = 'MEDIUM';
    let nExp = 'Important for vegetative plant growth and leaf canopy development.';
    let nGuidance = '';

    if (n < 280) {
      nStatus = 'LOW';
      nExp = 'Below reference range (< 280 kg/ha). Soil requires nitrogen reinforcement.';
      nGuidance = 'Incorporate split applications of neem-coated urea or composted cattle manure.';
      attentionItems.push(`low nitrogen (${n} kg/ha)`);
      practicalGuidance.push(nGuidance);
    } else if (n > 560) {
      nStatus = 'HIGH';
      nExp = 'High available Nitrogen status (> 560 kg/ha).';
      normalItems.push(`nitrogen (${n} kg/ha) is high`);
    } else {
      nStatus = 'MEDIUM';
      nExp = 'Adequate Nitrogen balance (280 - 560 kg/ha) for general vegetative growth.';
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
      managementGuidance: nGuidance || 'Apply balanced split nitrogen doses according to crop stages.',
      isAvailable: true,
    });
  }

  // 4. Phosphorus (P) in kg/ha
  if (input.phosphorus && typeof input.phosphorus.value === 'number') {
    const p = input.phosphorus.value;
    const unit = input.phosphorus.unit || 'kg/ha';
    let pStatus: SoilParameterStatus['status'] = 'MEDIUM';
    let pExp = 'Helps root development, early seedling vigor, and flower/seed formation.';
    let pGuidance = '';

    if (p < 10) {
      pStatus = 'LOW';
      pExp = 'Below reference range (< 10 kg/ha). Low Phosphorus can delay root establishment.';
      pGuidance = 'Apply Single Super Phosphate (SSP) or DAP placed 3-5 cm below seed level during sowing.';
      attentionItems.push(`low phosphorus (${p} kg/ha)`);
      practicalGuidance.push(pGuidance);
    } else if (p > 25) {
      pStatus = 'HIGH';
      pExp = 'Excellent available Phosphorus reserve (> 25 kg/ha).';
      normalItems.push(`phosphorus (${p} kg/ha) is high`);
    } else {
      pStatus = 'MEDIUM';
      pExp = 'Good baseline Phosphorus status (10 - 25 kg/ha).';
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

  // 5. Potassium (K) in kg/ha
  if (input.potassium && typeof input.potassium.value === 'number') {
    const k = input.potassium.value;
    const unit = input.potassium.unit || 'kg/ha';
    let kStatus: SoilParameterStatus['status'] = 'MEDIUM';
    let kExp = 'Improves disease resistance, grain weight, and drought resilience.';
    let kGuidance = '';

    if (k < 108) {
      kStatus = 'LOW';
      kExp = 'Below reference range (< 108 kg/ha). Increases crop vulnerability to stress and lodging.';
      kGuidance = 'Apply Muriate of Potash (MOP / 0-0-60) at sowing or early vegetative stage.';
      attentionItems.push(`low potassium (${k} kg/ha)`);
      practicalGuidance.push(kGuidance);
    } else if (k > 280) {
      kStatus = 'HIGH';
      kExp = 'High available Potassium (> 280 kg/ha) supporting crop vigor.';
      normalItems.push(`potassium (${k} kg/ha) is high`);
    } else {
      kStatus = 'MEDIUM';
      kExp = 'Satisfactory Potassium balance (108 - 280 kg/ha).';
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
      managementGuidance: kGuidance || 'Continue standard potash application for fruit and grain fill.',
      isAvailable: true,
    });
  }

  // 6. Electrical Conductivity (EC) in dS/m
  if (input.electricalConductivity && typeof input.electricalConductivity.value === 'number') {
    const ec = input.electricalConductivity.value;
    const unit = input.electricalConductivity.unit || 'dS/m';
    let ecStatus: SoilParameterStatus['status'] = 'NORMAL';
    let ecExp = 'Measures total soluble salts in soil solution.';
    let ecGuidance = '';

    if (ec > 2.0) {
      ecStatus = 'HIGH';
      ecExp = 'High electrical conductivity indicating possible salinity stress.';
      ecGuidance = 'Ensure proper field drainage channels and flush excess salt with fresh water.';
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
      managementGuidance: ecGuidance || 'Soluble salt level is safe for crop root development.',
      isAvailable: true,
    });
  }

  // 7. Sulphur (S) in ppm
  if (input.sulfur && typeof input.sulfur.value === 'number') {
    const s = input.sulfur.value;
    let sStatus: SoilParameterStatus['status'] = 'NORMAL';
    let sGuidance = '';
    if (s < 10.0) {
      sStatus = 'DEFICIENT';
      sGuidance = 'Apply gypsum or elemental sulphur (20-25 kg/ha) for oilseeds and pulse crops.';
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
      explanation: 'Essential for oil synthesis in mustard/soybean and protein in pulses.',
      managementGuidance: sGuidance || 'Sulphur level is adequate.',
      isAvailable: true,
    });
  }

  // 8. Zinc (Zn) in ppm
  if (input.zinc && typeof input.zinc.value === 'number') {
    const zn = input.zinc.value;
    let znStatus: SoilParameterStatus['status'] = 'NORMAL';
    let znGuidance = '';
    if (zn < 0.60) {
      znStatus = 'DEFICIENT';
      znGuidance = 'Apply Zinc Sulphate (20-25 kg/ha ZnSO4) as soil basal dressing.';
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
      explanation: 'Key enzyme activator. Deficiency causes Khaira disease in paddy.',
      managementGuidance: znGuidance || 'Zinc level is sufficient.',
      isAvailable: true,
    });
  }

  // 9. Iron (Fe) in ppm
  if (input.iron && typeof input.iron.value === 'number') {
    const fe = input.iron.value;
    let feStatus: SoilParameterStatus['status'] = 'NORMAL';
    let feGuidance = '';
    if (fe < 4.5) {
      feStatus = 'DEFICIENT';
      feGuidance = 'Apply Ferrous Sulphate (FeSO4) or foliar spray with 1% FeSO4.';
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
      explanation: 'Essential for chlorophyll synthesis and leaf greening.',
      managementGuidance: feGuidance || 'Iron level is sufficient.',
      isAvailable: true,
    });
  }

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

  let summaryExplanation = '';
  if (attentionItems.length > 0) {
    summaryExplanation = `Your latest soil report indicates ${attentionItems.join(', ')}, while ${
      normalItems.length > 0 ? normalItems.slice(0, 3).join(', ') : 'other nutrients'
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
};

/**
 * Upload PDF / JPG / PNG soil report to backend for extraction
 */
export const uploadSoilReportFile = async (
  file: File
): Promise<DocumentUploadExtractionResult> => {
  const formData = new FormData();
  formData.append('report', file);

  try {
    const res = await fetch(`${API_ENDPOINTS.SOIL_REPORTS}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Upload failed with status ${res.status}`);
    }

    const data: DocumentUploadExtractionResult = await res.json();
    return data;
  } catch (err: any) {
    console.error('Error uploading soil document:', err);
    throw err;
  }
};

/**
 * Verify and save soil report (with MongoDB persistence & localStorage caching)
 */
export const verifyAndSaveSoilReport = async (
  input: SoilReportInput
): Promise<SoilReportRecord> => {
  const now = new Date().toISOString();
  const id = `soil_${Date.now()}`;
  const farmerId = 'farmer_local';
  const farmId = 'farm_local';

  let savedRecord: SoilReportRecord = {
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
      sulfur: input.sulfur,
      zinc: input.zinc,
      iron: input.iron,
      copper: input.copper,
      manganese: input.manganese,
      boron: input.boron,
    }),
  };

  try {
    const res = await fetch(`${API_ENDPOINTS.SOIL_REPORTS}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        farmerId,
        farmId,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.report) {
        savedRecord = {
          ...json.report,
          id: json.report._id || savedRecord.id,
          interpretation: json.interpretation || savedRecord.interpretation,
        };
      }
    }
  } catch (apiErr) {
    console.warn('Backend verify endpoint offline, using local storage cache:', apiErr);
  }

  // Update localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const existing = getSoilReports();
      const updated = [savedRecord, ...existing.filter((r) => r.id !== savedRecord.id)];
      localStorage.setItem(SOIL_REPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save soil report to localStorage:', e);
    }
  }

  return savedRecord;
};

export const saveSoilReport = async (input: SoilReportInput): Promise<SoilReportRecord> => {
  return verifyAndSaveSoilReport(input);
};

export const getSoilReports = (): SoilReportRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SOIL_REPORTS_STORAGE_KEY);
    if (!data) return [];
    const list: SoilReportRecord[] = JSON.parse(data);
    return list.map((item) => ({
      ...item,
      interpretation:
        item.interpretation ||
        interpretSoilParameters({
          ph: item.ph,
          nitrogen: item.nitrogen,
          phosphorus: item.phosphorus,
          potassium: item.potassium,
          organicCarbon: item.organicCarbon,
          electricalConductivity: item.electricalConductivity,
          sulfur: item.sulfur,
          zinc: item.zinc,
          iron: item.iron,
          copper: item.copper,
          manganese: item.manganese,
          boron: item.boron,
        }),
    }));
  } catch (e) {
    console.error('Error reading soil reports from localStorage', e);
    return [];
  }
};

/**
 * Returns latest verified soil report
 */
export const getLatestSoilReport = (): SoilReportRecord | null => {
  const reports = getSoilReports();
  if (reports.length === 0) return null;
  // Return newest verified report
  const verified = reports.filter((r) => r.isVerified !== false);
  return verified.length > 0 ? verified[0] : reports[0];
};

export const getSoilReportById = (id: string): SoilReportRecord | null => {
  const reports = getSoilReports();
  return reports.find((r) => r.id === id) || null;
};

export const deleteSoilReport = (id: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSoilReports();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(SOIL_REPORTS_STORAGE_KEY, JSON.stringify(filtered));

    // Also trigger backend deletion
    fetch(`${API_ENDPOINTS.SOIL_REPORTS}/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {
    console.error('Failed to delete soil report', e);
  }
};

/**
 * Compute chronological progression points for soil trends
 */
export const getSoilTrends = (): SoilTrendPoint[] => {
  const reports = getSoilReports().filter((r) => r.isVerified !== false);
  if (reports.length === 0) return [];

  // Sort ascending by test date
  const sorted = [...reports].sort(
    (a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
  );

  return sorted.map((r) => ({
    id: r.id,
    testDate: r.testDate,
    ph: r.ph,
    oc: r.organicCarbon?.value,
    n: r.nitrogen?.value,
    p: r.phosphorus?.value,
    k: r.potassium?.value,
    ec: r.electricalConductivity?.value,
    overallStatus: r.interpretation?.overallStatus || 'BALANCED',
  }));
};
