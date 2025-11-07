// src/module-2/components/auth/OTPVerification.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import '../../styles/OTPVerification.css';

interface Props {
  mobile?: string;
  onOTPVerified: (isLoginMode: boolean) => void;
  onResendOTP: () => void;
  isLoginMode?: boolean;
}

const OTPVerification: React.FC<Props> = ({ 
  mobile: propsMobile, 
  onOTPVerified, 
  onResendOTP,
  isLoginMode = false
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number>(60);
  const navigate = useNavigate();

  const [mobile, setMobile] = useState(propsMobile || localStorage.getItem('authMobile') || '');

  useEffect(() => {
    if (!mobile) {
      navigate('/auth/mobile', { replace: true });
    }
  }, [mobile, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Reset countdown when component mounts
    setCountdown(60);
  }, []);

  if (!mobile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authApi.verifyOTP(mobile, cleanOtp);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      onOTPVerified(isLoginMode);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      setError('Please wait before resending OTP');
      return;
    }
    try {
      await authApi.resendOTP(mobile);
      setCountdown(60);
      onResendOTP();
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="auth-page">
      <div className="otp-container">
        <h2>Verify Your Mobile</h2>
        <p className="otp-description">
          We've sent a 6-digit code to <strong>+91 {mobile}</strong>
        </p>
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="input-group">
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 6) setOtp(val);
                if (error) setError('');
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="otp-input"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="otp-actions">
            <button
              type="submit"
              disabled={loading}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0}
              className="resend-btn"
            >
              {countdown > 0 ? `Resend (${formatTime(countdown)})` : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;