const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const User = require("../models/User");
const Business = require("../models/Business");
const { verifyToken } = require("../middleware/authMiddleware");
const otpSendTracker = new Map();
const otpVerifyTracker = new Map();
const axios = require("axios");

// Initialize Twilio client only if credentials are provided
let twilioClient = null;
let twilioVerifyService = null;
let useTwilioVerify = false;
const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY || "747ae4d3-bdff-11f0-bdde-0200cd936042";

// Helper function to clean and normalize phone number
const normalizePhone = (phone) => {
  if (!phone) return null;
  // Remove all characters except digits and leading +
  let cleaned = String(phone).trim().replace(/[^\d+]/g, "");

  // If starts with + and digits, assume already in E.164 or close enough
  if (cleaned.startsWith("+")) {
    const digits = cleaned.replace(/[^\d]/g, "");
    return `+${digits}`;
  }

  // Handle 00 international prefix -> replace with +
  if (cleaned.startsWith("00")) {
    const digits = cleaned.slice(2).replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  }

  // Handle Indian numbers
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    // Leading 0 - local format
    const digits = cleaned.slice(1);
    if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  }
  if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    // 10-digit local number -> assume +91
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    // 91XXXXXXXXXX provided without plus
    return `+${cleaned}`;
  }

  // Generic fallback: if looks like an international number (11-15 digits), prefix +
  if (cleaned.length >= 11 && cleaned.length <= 15 && /^\d+$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  return null;
};

// ✅ Generate and send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    // Normalize phone number (clean and format)
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone || !/^\+[0-9]{10,15}$/.test(normalizedPhone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // ALWAYS generate OTP first
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Basic rate limiting and resend cooldown
    const now = Date.now();
    const sendRec = otpSendTracker.get(normalizedPhone) || { count: 0, windowStart: now, lastSent: 0 };
    if (now - sendRec.lastSent < 60 * 1000) {
      return res.status(429).json({ message: "Please wait before requesting another OTP" });
    }
    if (now - sendRec.windowStart > 15 * 60 * 1000) {
      sendRec.windowStart = now;
      sendRec.count = 0;
    }
    if (sendRec.count >= 5) {
      return res.status(429).json({ message: "Too many OTP requests. Try again later." });
    }
    sendRec.count += 1;
    sendRec.lastSent = now;
    otpSendTracker.set(normalizedPhone, sendRec);

    // Check if user already exists
    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser && existingUser.isProfileComplete) {
      // User exists and profile is complete - this is a login
      // Generate OTP for login
    } else if (existingUser && !existingUser.isProfileComplete) {
      // User exists but profile incomplete - allow OTP for completion
    }
    // New user - allow OTP for registration

    if (process.env.NODE_ENV !== 'production' && !TWO_FACTOR_API_KEY) {
      console.log("\n" + "=".repeat(70));
      console.log("🔐 ========== OTP GENERATED ==========");
      console.log(`📱 Phone Number: ${normalizedPhone}`);
      console.log(`🔑 OTP CODE: ${otp}`);
      console.log(`⏰ Expires in: 5 minutes`);
      console.log(`💡 Use this OTP to verify: ${otp}`);
      console.log("=".repeat(70) + "\n");
    }

    // Try to send OTP via Twilio if configured
    if (TWO_FACTOR_API_KEY) {
      try {
        const twoFactorPhone = normalizedPhone.replace(/^\+/, "");
        const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${encodeURIComponent(twoFactorPhone)}/AUTOGEN`;
        const { data } = await axios.get(url, { timeout: 10000 });
        if (data && (data.Status === 'Success' || data.status === 'success') && data.Details) {
          const twoFactorExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
          await OTP.findOneAndUpdate(
            { phone: normalizedPhone },
            {
              verificationSid: data.Details,
              otpHash: "",
              expiresAt: twoFactorExpiresAt
            },
            { upsert: true }
          );
        } else {
          await OTP.findOneAndUpdate(
            { phone: normalizedPhone },
            { otpHash, expiresAt, verificationSid: "" },
            { upsert: true }
          );
        }
      } catch (twoFactorError) {
        await OTP.findOneAndUpdate(
          { phone: normalizedPhone },
          { otpHash, expiresAt, verificationSid: "" },
          { upsert: true }
        );
      }
    } else {
      // Development mode: store OTP (already logged above)
      await OTP.findOneAndUpdate(
        { phone: normalizedPhone },
        { otpHash, expiresAt, verificationSid: "" },
        { upsert: true }
      );
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP: " + err.message });
  }
});

// ✅ Verify OTP and check if profile is complete
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone & OTP required" });

    // Normalize phone number (same as in send-otp)
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone || !/^\+[0-9]{10,15}$/.test(normalizedPhone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Validate OTP format (6 digit numeric)
    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Basic attempt limiting
    const nowVerify = Date.now();
    const vrec = otpVerifyTracker.get(normalizedPhone) || { count: 0, windowStart: nowVerify };
    if (nowVerify - vrec.windowStart > 15 * 60 * 1000) {
      vrec.windowStart = nowVerify;
      vrec.count = 0;
    }
    if (vrec.count >= 5) {
      return res.status(429).json({ message: "Too many attempts. Try again later." });
    }
    vrec.count += 1;
    otpVerifyTracker.set(normalizedPhone, vrec);

    // Prefer Twilio Verify when available AND a verificationSid exists for this phone.
    // Otherwise, gracefully fall back to local bcrypt-based OTP verification.
    const otpRecord = await OTP.findOne({ phone: normalizedPhone });

    if (TWO_FACTOR_API_KEY && otpRecord && otpRecord.verificationSid) {
      try {
        const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${encodeURIComponent(otpRecord.verificationSid)}/${encodeURIComponent(otp)}`;
        const { data } = await axios.get(url, { timeout: 10000 });
        if (!(data && (data.Status === 'Success' || data.status === 'success'))) {
          return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }
        await OTP.deleteOne({ phone: normalizedPhone });
        otpVerifyTracker.delete(normalizedPhone);
      } catch (verifyErr) {
        if (otpRecord && otpRecord.otpHash) {
          if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ phone: normalizedPhone });
            return res.status(400).json({ message: "OTP expired" });
          }
          const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
          if (!isValid) return res.status(400).json({ message: "Invalid OTP" });
          await OTP.deleteOne({ phone: normalizedPhone });
          otpVerifyTracker.delete(normalizedPhone);
        } else {
          return res.status(400).json({ message: "OTP verification failed" });
        }
      }
    } else {
      // Standard/local OTP verification (using bcrypt)
      if (!otpRecord) return res.status(400).json({ message: "OTP expired or not found" });

      if (new Date() > otpRecord.expiresAt) {
        await OTP.deleteOne({ phone: normalizedPhone });
        return res.status(400).json({ message: "OTP expired" });
      }

      const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
      if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

      // Delete OTP after verification
      await OTP.deleteOne({ phone: normalizedPhone });
      otpVerifyTracker.delete(normalizedPhone);
    }

    // Check if user exists
    let user = await User.findOne({ phone: normalizedPhone });
    const isNewUser = !user;
    const needsProfileCompletion = !user || !user.isProfileComplete;

    // Create user if doesn't exist
    if (!user) {
      user = await User.findOneAndUpdate(
        { phone: normalizedPhone },
        {
          $setOnInsert: {
            phone: normalizedPhone,
            name: "User",
            businessName: "My Business",
            businessType: "Other",
            isProfileComplete: false
          }
        },
        { new: true, upsert: true }
      );
    }

    // If profile is complete, generate full token
    if (user.isProfileComplete) {
      const token = jwt.sign(
        { id: user._id, phone: user.phone, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token,
        needsProfileCompletion: false,
        isNewUser: false,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          businessType: user.businessType,
          role: user.role,
          isProfileComplete: user.isProfileComplete
        },
      });
    }

    // Profile incomplete - generate temporary token for profile completion
    const tempToken = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role, temp: true },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({
      success: true,
      tempToken,
      needsProfileCompletion: true,
      isNewUser,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        isProfileComplete: user.isProfileComplete
      },
    });
  } catch (err) {
    console.error("Verify Error:", err);
    // If duplicate key error occurred due to a race, fetch existing user and proceed
    if (err.code === 11000) {
      try {
        const normalizedPhone = normalizePhone(req.body.phone);
        const user = await User.findOne({ phone: normalizedPhone });
        if (!user) {
          return res.status(500).json({ message: "Verification race condition occurred. Please try again." });
        }
        if (user.isProfileComplete) {
          const token = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          return res.json({ success: true, token, needsProfileCompletion: false, isNewUser: false, user: {
            id: user._id, phone: user.phone, name: user.name, email: user.email, businessName: user.businessName, businessType: user.businessType, role: user.role, isProfileComplete: user.isProfileComplete
          }});
        } else {
          const tempToken = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role, temp: true },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
          );
          return res.json({ success: true, tempToken, needsProfileCompletion: true, isNewUser: false, user: { id: user._id, phone: user.phone, name: user.name, isProfileComplete: user.isProfileComplete } });
        }
      } catch (e) {
        return res.status(500).json({ message: "OTP verification failed: " + e.message });
      }
    }
    res.status(500).json({ message: "OTP verification failed: " + err.message });
  }
});

// ✅ Complete user profile
router.post("/complete-profile", verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      businessName,
      businessType,
      gstin,
      address,
    } = req.body;

    if (!name || !businessName || !businessType) {
      return res.status(400).json({ 
        message: "Name, business name, and business type are required" 
      });
    }

    // Phone number belongs to the authenticated user; proceed to update profile

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email: email || "",
        businessName,
        businessType,
        gstin: gstin || "",
        address: address || {},
        isProfileComplete: true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create or update business profile
    await Business.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        ownerId: user._id,
        businessName,
        businessType,
        gstin: gstin || "",
        address: address || {},
        contact: {
          phone: user.phone,
          email: email || "",
        },
        isDefault: true
      },
      { upsert: true, new: true }
    );

    // Generate final JWT token
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        businessName: user.businessName,
        businessType: user.businessType,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) {
    console.error("Profile Completion Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
    res.status(500).json({ message: "Profile completion failed: " + err.message });
  }
});

// ✅ Get current user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const business = await Business.findOne({ userId: user._id });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        businessName: user.businessName,
        businessType: user.businessType,
        gstin: user.gstin,
        address: user.address,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        subscription: user.subscription,
      },
      business: business || null,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Failed to get profile: " + err.message });
  }
});

module.exports = router;
