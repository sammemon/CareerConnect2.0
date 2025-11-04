// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const path = require('path');

// Database connection
const { testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const employerRoutes = require('./routes/employerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const profileRoutes = require('./routes/profileRoutes');
const socialRoutes = require('./routes/socialRoutes');
const profilePicRoutes = require('./routes/profilePicRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

// Initialize express app
const app = express();

// -------------------------------
// Security middleware
// -------------------------------
app.use(helmet());

// -------------------------------
// CORS configuration (allow common local dev ports and env override)
// -------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// -------------------------------
// Body parser middleware
// -------------------------------
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// -------------------------------
// Request logging middleware
// -------------------------------
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// -------------------------------
// Test database connection
// -------------------------------
testConnection();

// -------------------------------
// API Routes (keep original order)
// -------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/profile', profilePicRoutes);

// Gemini/chat route for CareerAdvice assistant
// geminiRoutes defines POST /gemini-chat
app.use('/api', geminiRoutes);

// -------------------------------
// Serve profile pictures statically (before 404 handler)
// -------------------------------
app.use('/uploads/profile_pics', express.static(path.join(__dirname, 'uploads/profile_pics')));

// -------------------------------
// Health check route
// -------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerConnect API is running',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------
// Root route
// -------------------------------
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CareerConnect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      employer: '/api/employer',
      admin: '/api/admin',
      contact: '/api/contact',
      profile: '/api/profile',
      social: '/api/social',
      gemini: '/api/gemini-chat',
      health: '/api/health'
    }
  });
});

// -------------------------------
// 404 handler
// -------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// -------------------------------
// Global error handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// -------------------------------
// Start server
// -------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║         🚀 CareerConnect API Server Running 🚀                    ║
║                                                                    ║
║  🌐 Server:       http://localhost:${PORT}                              ║
║  🧩 Environment:  ${process.env.NODE_ENV || 'development'}                      ║
║  🗄️ Database:     ${process.env.DB_NAME || 'careerconnect'}                  ║
║                                                                    ║
║  📡 Key API Routes:                                                 ║
║     • /api/auth             (authentication)                        ║
║     • /api/jobs             (jobs CRUD/search)                       ║
║     • /api/employer         (employer endpoints)                     ║
║     • /api/admin            (admin endpoints)                        ║
║     • /api/contact          (contact form)                           ║
║     • /api/profile          (profile CRUD)                           ║
║     • /api/social           (social links / integrations)            ║
║     • /api/profile (static) profile pictures served at /uploads/...  ║
║     • /api/gemini-chat      (POST) ← Gemini chatbot endpoint         ║
║     • /api/health           (health check)                           ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
