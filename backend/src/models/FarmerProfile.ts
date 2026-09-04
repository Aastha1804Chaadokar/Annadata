import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmerProfile extends Document {
  farmerId: string;
  name: string;
  mobile: string;
  language: string;
  channelPreference: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerProfileSchema = new Schema<IFarmerProfile>(
  {
    farmerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    language: { type: String, default: 'Hindi (हिन्दी)' },
    channelPreference: { type: String, default: 'Smartphone' },
  },
  {
    timestamps: true,
  }
);

export const FarmerProfile = mongoose.model<IFarmerProfile>('FarmerProfile', FarmerProfileSchema);
