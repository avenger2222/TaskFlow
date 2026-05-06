import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Backend is running' });
  });

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err?.message,
    });
  });

  return app;
}

