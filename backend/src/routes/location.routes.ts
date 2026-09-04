import { Router } from 'express';
import { handleReverseGeocode } from '../controllers/location.controller.js';

const router = Router();

// GET /api/v1/location/reverse-geocode?lat=...&lng=...&accuracy=...
router.get('/reverse-geocode', handleReverseGeocode);

export default router;
