import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try loading .env from current directory or backend directory
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(process.cwd(), '..', '.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGO_DB_URI ||
    'mongodb://127.0.0.1:27017/annadata',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

