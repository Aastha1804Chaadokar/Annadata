import mongoose from 'mongoose';
import { env } from '../config/env.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] Connected to MongoDB at host: ${connection.connection.host}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    // In production environments, database connection failures should be logged gracefully
  }
};
