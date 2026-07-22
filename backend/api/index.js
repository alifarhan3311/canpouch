import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Ensure MongoDB connection is established for serverless functions
export default async (req, res) => {
  await connectDB();
  return app(req, res);
};