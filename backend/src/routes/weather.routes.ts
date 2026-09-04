import { Router } from 'express';
import { getWeatherForecast } from '../controllers/weather.controller.js';

const router = Router();

router.get('/forecast', getWeatherForecast);

export default router;
