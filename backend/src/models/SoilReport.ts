import mongoose, { Schema, Document } from 'mongoose';

export interface IValUnit {
  value: number;
  unit: string;
}

export interface ISoilReport extends Document {
  farmerId: string;
  farmId: string;
  ph: number;
  nitrogen: IValUnit;
  phosphorus: IValUnit;
  potassium: IValUnit;
  organicCarbon: IValUnit;
  electricalConductivity?: IValUnit;
  soilType: string;
  irrigationType: string;
  testDate: Date;
  source: 'manual_entry' | 'report_upload';
  reportFile?: {
    fileName?: string;
    originalName?: string;
    mimeType?: string;
    storageStatus: string;
  };
  units: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ValUnitSchema = new Schema<IValUnit>(
  {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SoilReportSchema = new Schema<ISoilReport>(
  {
    farmerId: { type: String, required: true, index: true },
    farmId: { type: String, required: true, index: true },
    ph: {
      type: Number,
      required: true,
      min: [0, 'pH must be at least 0'],
      max: [14, 'pH cannot exceed 14'],
    },
    nitrogen: { type: ValUnitSchema, required: true },
    phosphorus: { type: ValUnitSchema, required: true },
    potassium: { type: ValUnitSchema, required: true },
    organicCarbon: { type: ValUnitSchema, required: true },
    electricalConductivity: { type: ValUnitSchema, required: false },
    soilType: {
      type: String,
      required: true,
      enum: [
        'Alluvial',
        'Black',
        'Red',
        'Laterite',
        'Arid / Desert',
        'Mountain / Forest',
        'Other',
        'Unknown',
      ],
      default: 'Unknown',
    },
    irrigationType: {
      type: String,
      required: true,
      enum: ['Rain-fed', 'Borewell', 'Canal', 'Drip', 'Other'],
      default: 'Rain-fed',
    },
    testDate: { type: Date, required: true, default: Date.now },
    source: {
      type: String,
      required: true,
      enum: ['manual_entry', 'report_upload'],
      default: 'manual_entry',
    },
    reportFile: {
      fileName: String,
      originalName: String,
      mimeType: String,
      storageStatus: { type: String, default: 'File storage integration pending' },
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
