import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { logger } from '../src/utils/logger.js';

let dbConnected = false;

async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
    logger.info('MongoDB connected for Vercel Serverless');
  }
}

app.use(async (req, res, next) => {
  if (!dbConnected && process.env.VERCEL === 'true') {
    await ensureDB();
  }
  next();
});

app.get('/api/v1/health', async (req, res) => {
  await ensureDB();
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default app;