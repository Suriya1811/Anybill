// src/module-2/components/auth/ProfileSetup.tsx
import React, { useState } from 'react';
import { authApi } from '../../services/api';
import '../../styles/ProfileSetup.css';

interface Props {
  mobile: string;
  onComplete: () => void;
}

const ProfileSetup: React.FC<Props> = ({ mobile, onComplete }) => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !businessName.trim() || !location.trim() || !businessType.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(
        mobile,
        name.trim(),
        businessName.trim(),
        location.trim(),
        businessType.trim()
      );
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('token', res.token);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="profile-container">
        <h2>Complete Your Profile</h2>
        <p className="profile-description">
          Thank you for verifying your mobile number!
        </p>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Your Full Name"
              required
              className="profile-input"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Business Name"
              required
              className="profile-input"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (error) setError('');
              }}
              placeholder="Location (City)"
              required
              className="profile-input"
            />
          </div>
          <div className="input-group">
            <select
              value={businessType}
              onChange={(e) => {
                setBusinessType(e.target.value);
                if (error) setError('');
              }}
              required
              className="profile-input"
            >
              <option value="">Select Business Type</option>
              <option value="retail">Retail</option>
              <option value="distribution">Distribution</option>
              <option value="wholesale">Wholesale</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="service">Service-Based</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="fmcg">FMCG</option>
              <option value="textile">Textile</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
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
                Creating Account...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;