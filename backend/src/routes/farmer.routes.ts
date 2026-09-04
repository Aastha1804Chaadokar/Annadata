import { Router } from 'express';
import {
  saveFarmerProfile,
  getFarmerProfile,
  updateFarmProfile,
} from '../controllers/farmer.controller.js';

const router = Router();

// /api/v1/farmers/profile
router.post('/farmers/profile', saveFarmerProfile);
router.get('/farmers/profile', getFarmerProfile);
router.put('/farmers/profile', updateFarmProfile);

export default router;
