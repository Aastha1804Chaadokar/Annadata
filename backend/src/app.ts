import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes.js';
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

// Global Error Handler
app.use(errorHandler);

export default app;
