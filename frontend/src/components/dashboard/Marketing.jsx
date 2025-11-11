import React, { useState, useEffect } from "react";
import { campaignService } from "../../services/apiService";

export default function Marketing({ user }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "sms",
    message: "",
    recipients: { type: "all" }
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getAll();
      if (res.data.success) {
        setCampaigns(res.data.campaigns);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await campaignService.create(formData);
      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      alert("Failed to create campaign: " + err.response?.data?.message);
    }
  };

  const handleSend = async (id) => {
    if (!confirm("Are you sure you want to send this campaign?")) return;
    try {
      await campaignService.send(id);
      fetchCampaigns();
      alert("Campaign sent successfully!");
    } catch (err) {
      alert("Failed to send campaign: " + err.response?.data?.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="marketing-page">
      <div className="page-header">
        <h2>Marketing Campaigns</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "+ Create Campaign"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Create Campaign</h3>
          <div className="form-group">
            <label>Campaign Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="5"
              required
              placeholder="Use {name} for customer name"
            />
          </div>
          <div className="form-group">
            <label>Recipients</label>
            <select
              value={formData.recipients.type}
              onChange={(e) => setFormData({
                ...formData,
                recipients: { ...formData.recipients, type: e.target.value }
              })}
            >
              <option value="all">All Customers</option>
              <option value="selected">Selected Customers</option>
              <option value="filtered">Filtered Customers</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Create Campaign</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Stats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">No campaigns found</td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.type.toUpperCase()}</td>
                  <td>
                    {campaign.status === "completed" && <span className="badge success">Completed</span>}
                    {campaign.status === "draft" && <span className="badge">Draft</span>}
                    {campaign.status === "sending" && <span className="badge warning">Sending</span>}
                  </td>
                  <td>
                    {campaign.stats && (
                      <span>
                        {campaign.stats.sent || 0} sent, {campaign.stats.delivered || 0} delivered
                      </span>
                    )}
                  </td>
                  <td>
                    {campaign.status === "draft" && (
                      <button onClick={() => handleSend(campaign._id)} className="btn-sm">Send</button>
                    )}
                    <button className="btn-sm">View</button>
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

