// backend/services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('./otpService');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
const registerUser = async (mobile, name, businessName, location, businessType) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      if (existingUser.isProfileComplete) {
        throw new Error('Mobile number already registered');
      }
      // Update existing incomplete user
      existingUser.name = name;
      existingUser.businessName = businessName;
      existingUser.location = location;
      existingUser.businessType = businessType;
      existingUser.isProfileComplete = true;
      existingUser.updatedAt = Date.now();
      const updatedUser = await existingUser.save();
      return {
        user: updatedUser,
        token: generateToken(updatedUser._id)
      };
    }
    // Create new user
    const newUser = new User({
      mobile,
      name,
      businessName,
      location,
      businessType,
      isProfileComplete: true,
      isVerified: true,
      trialStart: new Date(),
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });
    const savedUser = await newUser.save();
    return {
      user: savedUser,
      token: generateToken(savedUser._id)
    };
  } catch (error) {
    throw new Error(`Registration error: ${error.message}`);
  }
};

// Login existing user
const loginUser = async (mobile) => {
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      throw new Error('User not found. Please register first.');
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    return {
      user,
      token: generateToken(user._id)
    };
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
};

// Send OTP for verification
const sendVerificationOTP = async (mobile) => {
  try {
    // Check if user exists and is verified
    const existingUser = await User.findOne({ mobile });
    if (existingUser && existingUser.isVerified) {
      // Allow sending OTP to already verified users (for login)
      // But don't create a new user record
      console.log('Sending OTP to already verified user:', mobile);
      // Continue with OTP sending
    }
    
    // Send OTP via Twilio
    const result = await sendOTP(mobile);
    
    // Create or update user record
    const user = await User.findOneAndUpdate(
      { mobile },
      { 
        mobile,
        isVerified: false,
        isProfileComplete: false,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
    
    return { success: true, userId: user._id };
  } catch (error) {
    throw new Error(`OTP sending error: ${error.message}`);
  }
};

// Verify OTP
const verifyOTPAndCompleteRegistration = async (mobile, otp) => {
  try {
    // Verify OTP with Twilio
    const verificationResult = await verifyOTP(mobile, otp);
    if (!verificationResult.success) {
      throw new Error('Invalid or expired OTP');
    }
    
    // Find or create user
    const user = await User.findOneAndUpdate(
      { mobile },
      { 
        isVerified: true,
        verifiedAt: new Date(),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      user,
      token: generateToken(user._id)
    };
  } catch (error) {
    throw new Error(`OTP verification error: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  sendVerificationOTP,
  verifyOTPAndCompleteRegistration
};