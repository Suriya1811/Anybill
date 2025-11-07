// src/module-3/dashboard/components/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../module-2/hooks/useAuth';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth/mobile');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Anybill Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name || user.businessName || user.mobile}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-section">
          <h2>Your Business Information</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Business Name</h3>
              <p>{user.businessName || 'Not provided'}</p>
            </div>
            <div className="info-card">
              <h3>Location</h3>
              <p>{user.location || 'Not provided'}</p>
            </div>
            <div className="info-card">
              <h3>Business Type</h3>
              <p>{user.businessType || 'Not provided'}</p>
            </div>
            <div className="info-card">
              <h3>Mobile</h3>
              <p>{user.mobile}</p>
            </div>
            <div className="info-card">
              <h3>Trial Ends</h3>
              <p>{user.trialEnd ? new Date(user.trialEnd).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">Create Invoice</button>
            <button className="action-btn">View Reports</button>
            <button className="action-btn">Manage Customers</button>
            <button className="action-btn">Settings</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;