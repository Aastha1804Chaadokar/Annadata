import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './db/connection.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`[Server] Annadata Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`[Server] Health check: http://localhost:${env.PORT}/api/v1/health`);
  });
};

startServer();
