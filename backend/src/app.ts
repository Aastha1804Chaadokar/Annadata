import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes.js';
import soilReportRoutes from './routes/soilReport.routes.js';
import cropRecommendationRoutes from './routes/cropRecommendation.routes.js';
import farmerRoutes from './routes/farmer.routes.js';
import locationRoutes from './routes/location.routes.js';
import authRoutes from './routes/auth.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

const app: Application = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', farmerRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1', soilReportRoutes);
app.use('/api/v1', cropRecommendationRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/assistant', assistantRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;


