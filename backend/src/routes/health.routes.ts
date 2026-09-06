import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../db/connection.js';

const router = Router();

const healthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Annadata API is running',
    service: 'Annadata Backend API',
    tagline: 'Har Kisan, Har Fasal, Har Faisla.',
    version: '0.1.0',
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
};

router.get('/health', healthHandler);
router.get('/api/health', healthHandler);

export default router;
