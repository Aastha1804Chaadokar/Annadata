import mongoose, { Schema, Document } from 'mongoose';

export interface IRankedCrop {
  crop: string;
  suitability: number;
  reasons: string[];
  whyNot?: string[];
}

export interface ICropRecommendationInputSnapshot {
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
  season: string;
  irrigation: string;
  previousCrop?: string;
  currentCrop?: string;
  landSize?: string;
}

export interface ICropRecommendation extends Document {
  farmerId: string;
  farmId: string;
  season: string;
  inputSnapshot: ICropRecommendationInputSnapshot;
  recommendations: IRankedCrop[];
  engineType: string;
  createdAt: Date;
  updatedAt: Date;
}

const RankedCropSchema = new Schema<IRankedCrop>(
  {
    crop: { type: String, required: true },
    suitability: { type: Number, required: true, min: 0, max: 100 },
    reasons: [{ type: String }],
    whyNot: [{ type: String }],
  },
  { _id: false }
);

const CropRecommendationSchema = new Schema<ICropRecommendation>(
  {
    farmerId: { type: String, required: true, index: true },
    farmId: { type: String, required: true, index: true },
    season: { type: String, required: true },
    inputSnapshot: { type: Schema.Types.Mixed, required: true },
    recommendations: [RankedCropSchema],
    engineType: { type: String, default: 'Initial rule-based recommendation' },
  },
  {
    timestamps: true,
  }
);

export const CropRecommendation = mongoose.model<ICropRecommendation>(
  'CropRecommendation',
  CropRecommendationSchema
);
