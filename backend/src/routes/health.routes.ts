import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Annadata Backend API',
    tagline: 'Har Kisan, Har Fasal, Har Faisla.',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;
