// backend/controllers/authController.js
const { 
  registerUser, 
  loginUser, 
  sendVerificationOTP, 
  verifyOTPAndCompleteRegistration 
} = require('../services/authService');

// POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ 
        error: 'Valid 10-digit Indian mobile required (starting with 6-9).' 
      });
    }
    
    // Format mobile number with country code
    const formattedMobile = `+91${mobile}`;
    
    const result = await sendVerificationOTP(formattedMobile);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully.',
      userId: result.userId
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: error.message || 'Failed to send OTP. Please try again.' });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    
    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP are required.' });
    }
    
    // Format mobile number with country code
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    
    const result = await verifyOTPAndCompleteRegistration(formattedMobile, otp);
    
    res.json({ 
      success: true, 
      verified: true,
      user: {
        _id: result.user._id,
        mobile: result.user.mobile,
        name: result.user.name,
        businessName: result.user.businessName,
        location: result.user.location,
        businessType: result.user.businessType,
        isVerified: result.user.isVerified,
        isProfileComplete: result.user.isProfileComplete,
        trialEnd: result.user.trialEnd
      },
      token: result.token
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(400).json({ error: error.message || 'Invalid or expired OTP.' });
  }
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { mobile, name, businessName, location, businessType } = req.body;
    
    if (!mobile || !name || !businessName || !location || !businessType) {
      return res.status(400).json({ 
        error: 'Mobile, name, business name, location, and business type are required.' 
      });
    }
    
    // Format mobile number with country code
    const formattedMobile = `+91${mobile}`;
    
    const result = await registerUser(formattedMobile, name, businessName, location, businessType);
    
    res.json({ 
      success: true,
      user: {
        _id: result.user._id,
        mobile: result.user.mobile,
        name: result.user.name,
        businessName: result.user.businessName,
        location: result.user.location,
        businessType: result.user.businessType,
        isVerified: result.user.isVerified,
        isProfileComplete: result.user.isProfileComplete,
        trialEnd: result.user.trialEnd
      },
      token: result.token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message || 'Registration failed.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    
    // Format mobile number with country code
    const formattedMobile = `+91${mobile}`;
    
    const result = await loginUser(formattedMobile);
    
    res.json({ 
      success: true,
      user: {
        _id: result.user._id,
        mobile: result.user.mobile,
        name: result.user.name,
        businessName: result.user.businessName,
        location: result.user.location,
        businessType: result.user.businessType,
        isVerified: result.user.isVerified,
        isProfileComplete: result.user.isProfileComplete,
        trialEnd: result.user.trialEnd
      },
      token: result.token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).json({ error: error.message || 'Login failed.' });
  }
};

// POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ 
        error: 'Valid 10-digit Indian mobile required (starting with 6-9).' 
      });
    }
    
    // Format mobile number with country code
    const formattedMobile = `+91${mobile}`;
    
    const result = await sendVerificationOTP(formattedMobile);
    
    res.json({ 
      success: true, 
      message: 'OTP resent successfully.',
      userId: result.userId
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: error.message || 'Failed to resend OTP. Please try again.' });
  }
};