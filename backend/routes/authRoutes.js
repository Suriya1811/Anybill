// backend/routes/authRoutes.js
const express = require('express');
const { 
  sendOTP, 
  verifyOTP, 
  register, 
  login,
  resendOTP 
} = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

// POST /api/auth/register
router.post('/register', register);   

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/resend-otp
router.post('/resend-otp', resendOTP);

module.exports = router;