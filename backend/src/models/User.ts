import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  mobile: string;
  password: string;
  language?: string;
  state?: string;
  district?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  language: { type: String, default: 'hi' },
  state: { type: String, default: '' },
  district: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
