import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';

import authRoutes from '../src/routes/authRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';
import orderRoutes from '../src/routes/orderRoutes.js';
import complianceRoutes from '../src/routes/complianceRoutes.js';
import adminRoutes from '../src/routes/adminRoutes.js';
import reviewRoutes from '../src/routes/reviewRoutes.js';
import blogRoutes from '../src/routes/blogRoutes.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { globalLimiter } from '../src/middlewares/rateLimiters.js';
import { connectDB } from '../src/config/db.js';

const app = express();

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5175,http://localhost:5173').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin '${origin}' is not authorized by security policy.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/blogs', blogRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
  res.status(404).json({ success: false, statusCode: 404, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

let isReady = false;

async function initDB() {
  if (!isReady) {
    await connectDB();
    isReady = true;
  }
}

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  app(req, res);
});

const currentPort = parseInt(process.env.PORT || '3000', 10);

server.listen(currentPort, async () => {
  await initDB();
  console.log(`> Ready on http://localhost:${currentPort}`);
});

export default async function handler(req, res) {
  if (!isReady) {
    await initDB();
  }
  return app(req, res);
}