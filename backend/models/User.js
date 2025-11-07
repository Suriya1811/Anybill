// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  trialStart: {
    type: Date
  },
  trialEnd: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
userSchema.index({ mobile: 1 });

module.exports = mongoose.model('User', userSchema);