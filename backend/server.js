import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CollabSpace API is running',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CollabSpace API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      tasks: '/api/tasks',
      teams: '/api/teams',
      comments: '/api/comments',
      analytics: '/api/analytics'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ 
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log(`║  🚀 CollabSpace API Server Running    ║`);
  console.log(`║  📍 Port: ${PORT}                        ║`);
  console.log(`║  🌍 URL: http://localhost:${PORT}       ║`);
  console.log(`║  📊 Database: MongoDB Atlas            ║`);
  console.log(`║  🔧 Environment: ${process.env.NODE_ENV || 'development'}      ║`);
  console.log('╚════════════════════════════════════════╝');
});