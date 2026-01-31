// ========================
// Core imports
// ========================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const serverStartTime = Date.now();


// ========================
// App & config
// ========================
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ========================
// Security middlewares
// ========================

// Parse JSON body (limit untuk keamanan)
app.use(express.json({ limit: '10kb' }));

// Enable CORS
app.use(
  cors({
    origin: '*', // ⚠️ bisa dipersempit nanti
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ========================
// Routes
// ========================
const authRouter = require('./routes/auth');
const documentRouter = require('./routes/document.routes');

app.use(authRouter); // /login, /register, dll
app.use('/documents', documentRouter); // /documents/*

// ========================
// Global error handler
// ========================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);
  res.status(500).json({
    message: 'Internal Server Error',
  });
});

// ========================
// MongoDB connection
// ========================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected securely');

    // Start server ONLY if DB connected
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ========================
// Handle unhandled promise rejections
// ========================
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Courier App is running 🚀",
    status: "OK"
  });
});

app.get("/health", (req, res) => {
  const uptimeMs = Date.now() - serverStartTime;

  const seconds = Math.floor(uptimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const dbState = mongoose.connection.readyState;

  res.json({
    status: dbState === 1 ? "ok" : "error",
    app: "running",
    database: dbState === 1 ? "connected" : "disconnected",
    uptime: {
      hours,
      minutes: minutes % 60,
      seconds: seconds % 60
    },
    timestamp: new Date().toISOString(),
  });
});


