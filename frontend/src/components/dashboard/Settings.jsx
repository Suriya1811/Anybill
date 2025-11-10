import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Settings({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    businessName: user?.businessName || "",
    businessType: user?.businessType || "Retail",
    gstin: user?.gstin || "",
    address: user?.address || {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
        businessType: user.businessType || "Retail",
        gstin: user.gstin || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/complete-profile", formData);
      if (res.data.success) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Profile Settings</h3>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Business Name *</label>
              <input
                type="text"
                className="form-input"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Business Type *</label>
              <select
                className="form-select"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
              >
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Services">Services</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Construction">Construction</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">GSTIN</label>
            <input
              type="text"
              className="form-input"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              maxLength="15"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Street Address"
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <input
                type="text"
                className="form-input"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                className="form-input"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
              />
              <input
                type="text"
                className="form-input"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

