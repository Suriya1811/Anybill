const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  otpHash: { type: String, default: "" }, // Optional if using Twilio Verify
  verificationSid: { type: String, default: "" }, // For Twilio Verify API
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", otpSchema);
