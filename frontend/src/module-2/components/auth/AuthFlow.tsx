// frontend/src/module-2/components/auth/AuthFlow.tsx
import React, { useState, useEffect } from 'react';
import MobileInput from './MobileInput';
import OTPVerification from './OTPVerification';
import ProfileSetup from './ProfileSetup';

const AuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'mobile' | 'otp' | 'profile'>('mobile');
  const [mobile, setMobile] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);

  useEffect(() => {
    // Check URL for mode parameter
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'login') {
      setIsLoginMode(true);
    } else if (mode === 'register') {
      setIsLoginMode(false);
    }
  }, []);

  const handleMobileSubmit = (submittedMobile: string) => {
    setMobile(submittedMobile);
    setCurrentStep('otp');
  };

  const handleOTPVerified = (isLoginMode: boolean) => {
    if (isLoginMode) {
      window.location.href = '/dashboard';
    } else {
      setCurrentStep('profile');
    }
  };

  const handleResendOTP = () => {
    // Handle resend OTP logic
  };

  const handleProfileComplete = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="auth-flow-container">
      {currentStep === 'mobile' && (
        <MobileInput 
          onMobileSubmit={handleMobileSubmit} 
          isLogin={isLoginMode} 
        />
      )}
      {currentStep === 'otp' && (
        <OTPVerification 
          mobile={mobile} 
          onOTPVerified={(isLoginMode) => handleOTPVerified(isLoginMode)} 
          onResendOTP={handleResendOTP} 
          isLoginMode={isLoginMode}
        />
      )}
      {currentStep === 'profile' && (
        <ProfileSetup 
          mobile={mobile} 
          onComplete={handleProfileComplete} 
        />
      )}
    </div>
  );
};

export default AuthFlow;