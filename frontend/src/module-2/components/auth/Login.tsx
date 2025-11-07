import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import '../../../styles/Login.css';

const Login: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await authApi.login(cleanMobile);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Your Account</h2>
        <p className="login-description">
          Enter your mobile number to access your account
        </p>

        <form onSubmit={handleSubmit} className="login-form">
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

          {error && <p className="error">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/auth/register')}
              className="link-btn"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;