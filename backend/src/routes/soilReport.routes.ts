import { Router } from 'express';
import {
  createSoilReport,
  getSoilReportsByFarm,
  getSoilReportById,
  deleteSoilReport,
} from '../controllers/soilReport.controller.js';

const router = Router();

// /api/v1/soil-reports
router.post('/soil-reports', createSoilReport);
router.get('/soil-reports/farm/:farmId', getSoilReportsByFarm);
router.get('/soil-reports/:id', getSoilReportById);
router.delete('/soil-reports/:id', deleteSoilReport);

export default router;
