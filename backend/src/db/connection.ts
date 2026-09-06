import mongoose from 'mongoose';
import { env } from '../config/env.js';

// Fail fast: Never buffer Mongoose commands if the database is not connected
mongoose.set('bufferCommands', false);

let cachedPromise: Promise<boolean> | null = null;

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const connectDatabase = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  console.log('[Database] MongoDB connecting...');
  cachedPromise = (async () => {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
      });
      console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);
      return true;
    } catch (error: any) {
      const sanitizedMsg = error.message ? error.message.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb://***:***@') : error;
      console.error(`[Database] MongoDB connection failed: ${sanitizedMsg}`);
      cachedPromise = null;
      return false;
    }
  })();

  return cachedPromise;
};


