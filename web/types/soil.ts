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
}

export interface SoilReportInput {
  ph: number;
  nitrogen: ValueWithUnit;
  phosphorus: ValueWithUnit;
  potassium: ValueWithUnit;
  organicCarbon: ValueWithUnit;
  electricalConductivity?: ValueWithUnit;
  soilType: SoilTypeOption;
  irrigationType: string;
  testDate: string; // ISO date string
  source: 'manual_entry' | 'report_upload';
  reportFile?: {
    fileName?: string;
    originalName?: string;
    mimeType?: string;
    storageStatus: string;
  };
}

export interface SoilParameterStatus {
  parameter: string;
  value: number;
  unit: string;
  status: string;
  explanation: string;
  category: 'pH' | 'Nutrient' | 'Organic' | 'Salinity';
}

export interface SoilInterpretation {
  overallHealth: string;
  parameters: SoilParameterStatus[];
  recommendations: string[];
}

export interface SoilReportRecord extends SoilReportInput {
  id: string;
  farmerId: string;
  farmId: string;
  createdAt: string;
  updatedAt: string;
  interpretation?: SoilInterpretation;
}
