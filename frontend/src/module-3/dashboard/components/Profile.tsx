// src/module-3/dashboard/components/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../module-2/hooks/useAuth';
import '../../styles/Profile.css';

interface User {
  _id: string;
  mobile: string;
  name?: string;
  businessName?: string;
  location?: string;
  businessType?: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  trialEnd?: Date;
}

const Profile: React.FC = () => {
  const { user } = useAuth() as { user: User | null }; // Removed unused logout
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  if (!user) {
    navigate('/auth/mobile');
    return null;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      if (editedUser) {
        // Here you would typically make an API call to update the user
        localStorage.setItem('user', JSON.stringify(editedUser));
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [e.target.name]: e.target.value
      });
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>User Profile</h1>
        <div className="profile-actions">
          <button onClick={handleEditToggle} className={`edit-btn ${isEditing ? 'save' : 'edit'}`}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : user.mobile.charAt(0)}
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-field">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser?.name || ''}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span>{user.name || 'Not provided'}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Mobile:</label>
              <span>{user.mobile}</span>
            </div>
          </div>

          <div className="profile-section">
            <h2>Business Information</h2>
            <div className="profile-field">
              <label>Business Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="businessName"
                  value={editedUser?.businessName || ''}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span>{user.businessName || 'Not provided'}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Location:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={editedUser?.location || ''}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span>{user.location || 'Not provided'}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Business Type:</label>
              {isEditing ? (
                <select
                  name="businessType"
                  value={editedUser?.businessType || ''}
                  onChange={handleInputChange}
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
              ) : (
                <span>{user.businessType || 'Not provided'}</span>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Status</h2>
            <div className="profile-field">
              <label>Verified:</label>
              <span>{user.isVerified ? 'Yes' : 'No'}</span>
            </div>
            <div className="profile-field">
              <label>Profile Complete:</label>
              <span>{user.isProfileComplete ? 'Yes' : 'No'}</span>
            </div>
            <div className="profile-field">
              <label>Trial Ends:</label>
              <span>{user.trialEnd ? new Date(user.trialEnd).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;