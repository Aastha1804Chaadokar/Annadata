import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmLocation {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accuracy?: number;
  village?: string;
  locality?: string;
  subDistrict?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
  source?: 'device-geolocation' | 'manual';
  locationUpdatedAt?: Date;
}

export interface IFarm extends Document {
  farmId: string;
  farmerId: string;
  farmName?: string;
  state: string;
  district: string;
  village: string;
  location?: IFarmLocation;
  landSize: string;
  landUnit: 'Acres' | 'Bigha' | 'Hectares';
  mainCrop: string;
  currentCrop?: {
    cropId: string;
    cropName: string;
    cropNameHi: string;
    category: string;
    customCropName?: string;
  };
  irrigation: 'Rain-fed' | 'Borewell' | 'Canal' | 'Drip' | 'Other';
  farmingType: 'Small farmer' | 'Medium farmer' | 'Large farmer' | 'Other';
  createdAt: Date;
  updatedAt: Date;
}

const FarmSchema = new Schema<IFarm>(
  {
    farmId: { type: String, required: true, unique: true, index: true },
    farmerId: { type: String, required: true, index: true },
    farmName: { type: String, default: 'My Farm' },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    location: {
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      accuracy: Number,
      village: String,
      locality: String,
      subDistrict: String,
      district: String,
      state: String,
      country: String,
      postalCode: String,
      formattedAddress: String,
      source: {
        type: String,
        enum: ['device-geolocation', 'manual'],
        default: 'manual',
      },
      locationUpdatedAt: Date,
    },
    landSize: { type: String, required: true, default: '3.5' },
    landUnit: { type: String, enum: ['Acres', 'Bigha', 'Hectares'], default: 'Acres' },
    mainCrop: { type: String, required: true, default: 'Soybean (सोयाबीन)' },
    currentCrop: {
      cropId: String,
      cropName: String,
      cropNameHi: String,
      category: String,
      customCropName: String,
    },
    irrigation: {
      type: String,
      enum: ['Rain-fed', 'Borewell', 'Canal', 'Drip', 'Other'],
      default: 'Rain-fed',
    },
    farmingType: {
      type: String,
      enum: ['Small farmer', 'Medium farmer', 'Large farmer', 'Other'],
      default: 'Small farmer',
    },
  },
  {
    timestamps: true,
  }
);

export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);
