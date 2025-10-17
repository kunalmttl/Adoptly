// packages/backend/app.js

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

// --- Local Imports ---
const dbConnection = require('./config/mongoose-connection'); // Establishes DB connection
const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/usersRouter');
const petsRouter = require('./routes/petsRouter');
const applicationRouter = require('./routes/applicationRouter');
const uploadRouter = require('./routes/uploadRouter');
const contactRouter = require('./routes/contactRouter');

// --- App Initialization ---
const app = express();

// --- Pre-flight Checks for Essential Environment Variables ---
const requiredEnvVars = ['JWT_SECRET', 'FRONTEND_URL', 'MONGODB_URI'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`FATAL ERROR: Environment variable ${varName} is not defined.`);
    process.exit(1); // Exit the application if a required variable is missing.
  }
}

// --- Core Middleware ---

// Configure CORS to allow requests from the frontend.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Standard middleware for parsing JSON, URL-encoded data, and cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

// Health check route.
app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: 'Adoptly API is up and running!' });
});

// Mount API routers.
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/pets', petsRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/contact', contactRouter);

// --- Error Handling Middleware ---

// 404 Not Found handler.
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler.
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

module.exports = app;