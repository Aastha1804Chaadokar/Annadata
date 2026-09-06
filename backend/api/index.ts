import app from '../src/app.js';
import { connectDatabase } from '../src/db/connection.js';

export default async function handler(req: any, res: any) {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('[Vercel Serverless] Database connection error:', err);
  }
  return app(req, res);
}
