// backend/services/otpService.js
const twilio = require('twilio');
const crypto = require('crypto');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  console.error('Missing Twilio environment variables!');
  throw new Error('Missing Twilio environment variables in .env file');
}

const client = twilio(accountSid, authToken);

// Send OTP via Twilio Verify API
const sendOTP = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms'
      });
    console.log('Verification sent:', verification.sid);
    return { success: true, sid: verification.sid };
  } catch (error) {
    console.error('Twilio Verify error:', error);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

// Verify OTP using Twilio Verify API
const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otpCode
      });
    console.log('Verification result:', verificationCheck.status);
    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status
    };
  } catch (error) {
    console.error('Twilio Verify check error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};