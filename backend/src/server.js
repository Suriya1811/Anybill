require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.set('trust proxy', true);

// Security headers (conditionally enable Helmet if available)
try {
  // eslint-disable-next-line global-require
  const helmet = require('helmet');
  app.use(helmet());
} catch (e) {
  console.log('Helmet not installed; skipping security headers.');
}

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS blocked: origin not allowed'), false);
  },
  credentials: true
}));

// Connect to database
connectDB();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MyBillPro API is running 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/billing", require("./routes/billingRoutes"));
app.use("/api/billing", require("./routes/warehouseRoutes"));
app.use("/api/billing", require("./routes/inventoryRoutes"));
app.use("/api/billing", require("./routes/recurringRoutes"));
app.use("/api/billing", require("./routes/reportsRoutes"));
app.use("/api/billing", require("./routes/gstRoutes"));
app.use("/api/billing", require("./routes/staffRoutes"));
app.use("/api/billing", require("./routes/templateRoutes"));
app.use("/api/billing", require("./routes/bulkRoutes"));
app.use("/api/billing", require("./routes/businessRoutes"));
app.use("/api/billing", require("./routes/purchaseRoutes"));
app.use("/api/billing", require("./routes/marketingRoutes"));
app.use("/api/billing", require("./routes/loyaltyRoutes"));
app.use("/api/billing", require("./routes/eInvoiceRoutes"));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});
