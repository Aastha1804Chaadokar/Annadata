import mongoose, { Schema, Document } from 'mongoose';

export interface IParameterDetail {
  value: number;
  unit: string;
  status?: string;
  source?: 'ocr_extracted' | 'manual_entry' | 'lab_digital';
  confidence?: number;
  isAvailable?: boolean;
}

export interface ISoilReport extends Document {
  farmerId: string;
  farmId: string;
  userId?: string;

  // Metadata
  farmerName?: string;
  sampleId?: string;
  labName?: string;
  sampleDate?: Date;
  reportDate?: Date;
  village?: string;
  district?: string;
  state?: string;
  soilType: string;
  irrigationType: string;
  crop?: string;

  // Primary Nutrients & Characteristics
  ph: number;
  nitrogen: IParameterDetail;
  phosphorus: IParameterDetail;
  potassium: IParameterDetail;
  organicCarbon: IParameterDetail;
  electricalConductivity?: IParameterDetail;

  // Secondary & Micronutrients
  sulfur?: IParameterDetail;
  zinc?: IParameterDetail;
  iron?: IParameterDetail;
  copper?: IParameterDetail;
  manganese?: IParameterDetail;
  boron?: IParameterDetail;

  // Verification & Processing
  testDate: Date;
  source: 'manual_entry' | 'report_upload';
  isVerified: boolean;
  verificationStatus: 'verified' | 'unverified' | 'manual_entry';
  extractionConfidence?: number;
  overallHealthStatus?: 'GOOD' | 'NEEDS ATTENTION' | 'SIGNIFICANT DEFICIENCIES DETECTED' | 'BALANCED';
  summaryText?: string;
  recommendations?: string[];

  // File Storage
  reportFile?: {
    fileName?: string;
    originalName?: string;
    mimeType?: string;
    fileSize?: number;
    fileUrl?: string;
    storageStatus: string;
  };

  units: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ParameterDetailSchema = new Schema<IParameterDetail>(
  {
    value: { type: Number, required: true },
    unit: { type: String, required: true, trim: true },
    status: { type: String, default: 'Normal' },
    source: {
      type: String,
      enum: ['ocr_extracted', 'manual_entry', 'lab_digital'],
      default: 'manual_entry',
    },
    confidence: { type: Number, min: 0, max: 100, default: 100 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const SoilReportSchema = new Schema<ISoilReport>(
  {
    farmerId: { type: String, required: true, index: true },
    farmId: { type: String, required: true, index: true },
    userId: { type: String, index: true },

    farmerName: { type: String, trim: true },
    sampleId: { type: String, trim: true },
    labName: { type: String, trim: true },
    sampleDate: { type: Date },
    reportDate: { type: Date },
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    crop: { type: String, trim: true },

    ph: {
      type: Number,
      required: true,
      min: [0, 'pH must be at least 0'],
      max: [14, 'pH cannot exceed 14'],
    },
    nitrogen: { type: ParameterDetailSchema, required: true },
    phosphorus: { type: ParameterDetailSchema, required: true },
    potassium: { type: ParameterDetailSchema, required: true },
    organicCarbon: { type: ParameterDetailSchema, required: true },
    electricalConductivity: { type: ParameterDetailSchema, required: false },

    sulfur: { type: ParameterDetailSchema, required: false },
    zinc: { type: ParameterDetailSchema, required: false },
    iron: { type: ParameterDetailSchema, required: false },
    copper: { type: ParameterDetailSchema, required: false },
    manganese: { type: ParameterDetailSchema, required: false },
    boron: { type: ParameterDetailSchema, required: false },

    soilType: {
      type: String,
      required: true,
      default: 'Unknown',
    },
    irrigationType: {
      type: String,
      required: true,
      default: 'Rain-fed',
    },
    testDate: { type: Date, required: true, default: Date.now },
    source: {
      type: String,
      required: true,
      enum: ['manual_entry', 'report_upload'],
      default: 'manual_entry',
    },
    isVerified: { type: Boolean, default: true, index: true },
    verificationStatus: {
      type: String,
      enum: ['verified', 'unverified', 'manual_entry'],
      default: 'verified',
    },
    extractionConfidence: { type: Number, default: 100 },
    overallHealthStatus: {
      type: String,
      enum: ['GOOD', 'NEEDS ATTENTION', 'SIGNIFICANT DEFICIENCIES DETECTED', 'BALANCED'],
      default: 'BALANCED',
    },
    summaryText: { type: String },
    recommendations: [{ type: String }],

    reportFile: {
      fileName: String,
      originalName: String,
      mimeType: String,
      fileSize: Number,
      fileUrl: String,
      storageStatus: { type: String, default: 'Stored locally' },
    },
    units: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const SoilReport = mongoose.model<ISoilReport>('SoilReport', SoilReportSchema);
