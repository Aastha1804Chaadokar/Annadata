import app from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/db/connection.js';

export default async function handler(req: any, res: any) {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('[Root Vercel Serverless] Database connection error:', err);
  }
  return app(req, res);
}
