import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './db.js';

dotenv.config();

const app = createApp();

// Vercel serverless entry: export a handler (no app.listen).
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('Request failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Backend failed to start',
      error: err?.message,
    });
  }
}
