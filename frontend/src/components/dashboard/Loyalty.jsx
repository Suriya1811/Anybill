import React, { useState, useEffect } from "react";
import { loyaltyService, customerService } from "../../services/apiService";

export default function Loyalty({ user }) {
  const [loyalty, setLoyalty] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEarnForm, setShowEarnForm] = useState(false);
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [earnData, setEarnData] = useState({ customerId: "", amount: "", points: "" });
  const [redeemData, setRedeemData] = useState({ customerId: "", points: "" });

  useEffect(() => {
    fetchLoyalty();
    fetchCustomers();
  }, []);

  const fetchLoyalty = async () => {
    try {
      const res = await loyaltyService.getAll();
      if (res.data.success) {
        setLoyalty(res.data.loyalty);
      }
    } catch (err) {
      console.error("Failed to fetch loyalty:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getAll();
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const handleEarn = async (e) => {
    e.preventDefault();
    try {
      await loyaltyService.earn(earnData);
      setShowEarnForm(false);
      setEarnData({ customerId: "", amount: "", points: "" });
      fetchLoyalty();
      alert("Points earned successfully!");
    } catch (err) {
      alert("Failed to earn points: " + err.response?.data?.message);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    try {
      await loyaltyService.redeem(redeemData);
      setShowRedeemForm(false);
      setRedeemData({ customerId: "", points: "" });
      fetchLoyalty();
      alert("Points redeemed successfully!");
    } catch (err) {
      alert("Failed to redeem points: " + err.response?.data?.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="loyalty-page">
      <div className="page-header">
        <h2>Loyalty Program</h2>
        <div className="header-actions">
          <button onClick={() => setShowEarnForm(!showEarnForm)} className="btn-primary">
            Earn Points
          </button>
          <button onClick={() => setShowRedeemForm(!showRedeemForm)} className="btn-secondary">
            Redeem Points
          </button>
        </div>
      </div>

      {showEarnForm && (
        <form onSubmit={handleEarn} className="form-card">
          <h3>Earn Points</h3>
          <div className="form-group">
            <label>Customer *</label>
            <select
              value={earnData.customerId}
              onChange={(e) => setEarnData({ ...earnData, customerId: e.target.value })}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={earnData.amount}
              onChange={(e) => setEarnData({ ...earnData, amount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Points</label>
            <input
              type="number"
              value={earnData.points}
              onChange={(e) => setEarnData({ ...earnData, points: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Earn Points</button>
          <button type="button" onClick={() => setShowEarnForm(false)} className="btn-secondary">Cancel</button>
        </form>
      )}

      {showRedeemForm && (
        <form onSubmit={handleRedeem} className="form-card">
          <h3>Redeem Points</h3>
          <div className="form-group">
            <label>Customer *</label>
            <select
              value={redeemData.customerId}
              onChange={(e) => setRedeemData({ ...redeemData, customerId: e.target.value })}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Points to Redeem *</label>
            <input
              type="number"
              value={redeemData.points}
              onChange={(e) => setRedeemData({ ...redeemData, points: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Redeem Points</button>
          <button type="button" onClick={() => setShowRedeemForm(false)} className="btn-secondary">Cancel</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Points</th>
              <th>Tier</th>
              <th>Total Earned</th>
              <th>Total Redeemed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loyalty.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No loyalty records found</td>
              </tr>
            ) : (
              loyalty.map((l) => (
                <tr key={l._id}>
                  <td>{l.customerId?.name || "N/A"}</td>
                  <td><strong>{l.points || 0}</strong></td>
                  <td>
                    <span className={`badge tier-${l.tier}`}>{l.tier}</span>
                  </td>
                  <td>{l.totalEarned || 0}</td>
                  <td>{l.totalRedeemed || 0}</td>
                  <td>
                    <button className="btn-sm">View History</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

