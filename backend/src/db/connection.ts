import mongoose from 'mongoose';
import { env } from '../config/env.js';

// Fail fast: Never buffer Mongoose commands if the database is not connected
mongoose.set('bufferCommands', false);

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const connectDatabase = async (): Promise<boolean> => {
  console.log('[Database] MongoDB connecting...');
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB connected successfully to host: ${connection.connection.host}`);
    return true;
  } catch (error: any) {
    const sanitizedMsg = error.message ? error.message.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb://***:***@') : error;
    console.error(`[Database] MongoDB connection failed: ${sanitizedMsg}`);
    return false;
  }
};


