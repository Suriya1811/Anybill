import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import "../styles/auth.css";

const BUSINESS_TYPES = [
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Services",
  "E-commerce",
  "Restaurant",
  "Healthcare",
  "Construction",
  "Real Estate",
  "Other"
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    businessType: "Retail",
    gstin: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.businessName) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("tempToken");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/complete-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        // Use AuthContext login function
        login(res.data.token, res.data.user);
        localStorage.removeItem("tempToken");
      }
    } catch (err) {
      console.error("Profile Completion Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to complete profile";
      alert(errorMessage);
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("tempToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <h2>Complete Your Profile</h2>
        <p>Please provide your business details to get started.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)" }}>
                Full Name <span style={{ color: "var(--error-color)" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email (optional)"
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)" }}>
                Business Name <span style={{ color: "var(--error-color)" }}>*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                required
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)" }}>
                Business Type <span style={{ color: "var(--error-color)" }}>*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="auth-input"
              >
                {BUSINESS_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)" }}>
                GSTIN (Optional)
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="Enter GSTIN (if applicable)"
                className="auth-input"
                maxLength="15"
              />
            </div>

            <div style={{ marginTop: "8px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--text-primary)" }}>
                Address
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="auth-input"
                />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="auth-input"
                  />
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="auth-input"
                  />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="auth-input"
                  />
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? <Loader /> : "Complete Profile & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

