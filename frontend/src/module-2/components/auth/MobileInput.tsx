// src/module-2/components/auth/MobileInput.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../services/api';
import '../../styles/MobileInput.css';

interface Props {
  onMobileSubmit?: (mobile: string) => void;
  isLogin?: boolean;
}

const MobileInput: React.FC<Props> = ({ onMobileSubmit, isLogin = false }) => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(isLogin);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'login') setIsLoginMode(true);
    else if (mode === 'register') setIsLoginMode(false);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        // For login, call the login endpoint which sends OTP
        const response = await authApi.login(cleanMobile);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        // Redirect to dashboard directly
        window.location.href = '/dashboard';
      } else {
        // For registration, send OTP first
        await authApi.sendOTP(cleanMobile);
        localStorage.setItem('authMobile', cleanMobile);
        if (onMobileSubmit) {
          onMobileSubmit(cleanMobile);
        } else {
          // Navigate to OTP page if no callback
          navigate('/auth/otp');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  return (
    <div className="auth-fullscreen">
      <div className="form-panel">
        <div className="logo-placeholder">🌱</div>
        <h1>{isLoginMode ? 'Login to Your Account' : 'Enter Your Mobile Number'}</h1>
        <p className="subtitle">
          {isLoginMode
            ? 'We\'ll verify your account and grant access'
            : 'We\'ll send a 6-digit OTP to verify your account'}
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <span className="country-code">+91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setMobile(val);
                if (error) setError('');
              }}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
              className="mobile-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isLoginMode ? 'Verifying...' : 'Sending OTP...'}
              </>
            ) : isLoginMode ? (
              'Login'
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
        <div className="auth-toggle">
          <p>
            {isLoginMode 
              ? "Don't have an account? " 
              : 'Already have an account? '}
            <button onClick={toggleMode} className="toggle-btn">
              {isLoginMode ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
        <div className="footer-note">
          By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
        </div>
      </div>
      <div className="brand-panel">
        <div className="brand-content">
          <h2 className="brand-title">Anybill</h2>
          <p className="brand-tagline">Simplify Billing. Grow Your Business.</p>
          <div className="animated-logo">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileInput;