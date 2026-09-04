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
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Dynamic CORS configuration for Vercel, Render, Localhost, and custom domains
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // If wildcard or default
      if (env.CORS_ORIGIN === '*' || env.CORS_ORIGIN === 'all') {
        return callback(null, true);
      }

      // Check configured origins
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (
        allowedOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route for Render / uptime pingers
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    project: 'Annadata REST API',
    tagline: 'Har Kisan, Har Fasal, Har Faisla',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      farmers: '/api/v1/farmers',
      location: '/api/v1/location',
      soilReports: '/api/v1/soil-reports',
      cropRecommendations: '/api/v1/crop-recommendations',
      weather: '/api/v1/weather',
      assistant: '/api/v1/assistant',
    },
  });
});

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


