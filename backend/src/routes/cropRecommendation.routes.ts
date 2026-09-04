import { Router } from 'express';
import {
  generateCropRecommendation,
  getCropRecommendationsByFarm,
  getCropRecommendationById,
} from '../controllers/cropRecommendation.controller.js';

const router = Router();

// /api/v1/crop-recommendations
router.post('/crop-recommendations', generateCropRecommendation);
router.get('/crop-recommendations/farm/:farmId', getCropRecommendationsByFarm);
router.get('/crop-recommendations/:id', getCropRecommendationById);

export default router;
