import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`CanPouch Enterprise API Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
});
