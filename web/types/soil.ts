export type SoilTypeOption =
  | 'Alluvial'
  | 'Black'
  | 'Red'
  | 'Laterite'
  | 'Arid / Desert'
  | 'Mountain / Forest'
  | 'Other'
  | 'Unknown'
  | "I don't know";

export interface ValueWithUnit {
  value: number;
  unit: string;
  status?: string;
  source?: 'ocr_extracted' | 'lab_digital' | 'manual_entry';
  confidence?: number;
  isAvailable?: boolean;
}

export interface SoilParameterStatus {
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
  overallStatus: 'GOOD' | 'NEEDS ATTENTION' | 'SIGNIFICANT DEFICIENCIES DETECTED' | 'BALANCED';
  overallStatusTitle: string;
  summaryExplanation: string;
  attentionCount: number;
  optimalCount: number;
  totalEvaluated: number;
  parameters: SoilParameterStatus[];
  practicalGuidance: string[];
}

export interface SoilReportInput {
  farmerName?: string;
  sampleId?: string;
  labName?: string;
  sampleDate?: string;
  reportDate?: string;
  village?: string;
  district?: string;
  state?: string;
  soilType: SoilTypeOption | string;
  irrigationType: string;
  crop?: string;

  ph: number;
  nitrogen: ValueWithUnit;
  phosphorus: ValueWithUnit;
  potassium: ValueWithUnit;
  organicCarbon: ValueWithUnit;
  electricalConductivity?: ValueWithUnit;

  // Secondary & Micronutrients
  sulfur?: ValueWithUnit;
  zinc?: ValueWithUnit;
  iron?: ValueWithUnit;
  copper?: ValueWithUnit;
  manganese?: ValueWithUnit;
  boron?: ValueWithUnit;

  testDate: string; // ISO date string
  source: 'manual_entry' | 'report_upload';
  isVerified?: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'manual_entry';
  extractionConfidence?: number;

  reportFile?: {
    fileName?: string;
    originalName?: string;
    mimeType?: string;
    fileSize?: number;
    fileUrl?: string;
    storageStatus: string;
  };
}

export interface SoilReportRecord extends SoilReportInput {
  id: string;
  farmerId: string;
  farmId: string;
  userId?: string;
  overallHealthStatus?: 'GOOD' | 'NEEDS ATTENTION' | 'SIGNIFICANT DEFICIENCIES DETECTED' | 'BALANCED';
  summaryText?: string;
  recommendations?: string[];
  createdAt: string;
  updatedAt: string;
  interpretation?: SoilPositionSummary;
}

export interface SoilTrendPoint {
  id: string;
  testDate: string;
  ph: number;
  oc?: number;
  n?: number;
  p?: number;
  k?: number;
  ec?: number;
  overallStatus: string;
}

export interface DocumentUploadExtractionResult {
  success: boolean;
  fileInfo?: {
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    fileUrl: string;
  };
  extraction?: {
    success: boolean;
    extractedTextLength: number;
    overallConfidence: number;
    metadata: {
      farmerName?: string;
      sampleId?: string;
      labName?: string;
      sampleDate?: string;
      reportDate?: string;
      village?: string;
      district?: string;
      state?: string;
      soilType?: string;
      crop?: string;
    };
    parameters: {
      ph?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      nitrogen?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      phosphorus?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      potassium?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      organicCarbon?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      electricalConductivity?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      sulfur?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      zinc?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      iron?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      copper?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      manganese?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
      boron?: { value: number; unit: string; confidence: number; source: string; isAvailable: boolean };
    };
    warning?: string;
    isVisualPhotoOnly?: boolean;
  };
  error?: string;
}
