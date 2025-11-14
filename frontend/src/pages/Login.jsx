import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";
import Loader from "../components/Loader";
import "../styles/auth.css";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/\s|-|\(|\)/g, "");
    
    if (!cleanPhone.match(/^\+?\d{10,13}$/)) {
      setError("Please enter a valid phone number (e.g., +91 9876543210 or 9876543210)");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await authService.sendOTP(cleanPhone);
      if (res.data.success) {
        localStorage.setItem("tempPhone", cleanPhone);
        navigate("/verify");
      }
    } catch (err) {
      console.error("OTP Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP";
      setError(errorMessage);
      
      // Show OTP in console if backend is running
      if (err.response?.status === 500 || err.message.includes("Network Error")) {
        console.log("⚠️ Check backend console for OTP if Twilio is not configured");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2>Login with Mobile</h2>
        <p>Enter your phone number to receive an OTP.</p>
        <input
          type="tel"
          placeholder="+91 9876543210"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && sendOtp()}
        />
        {error && (
          <div className="error-message" style={{ marginTop: "12px", color: "var(--error-color)", fontSize: "14px" }}>
            {error}
          </div>
        )}
        <button onClick={sendOtp} disabled={loading || !phone.trim()}>
          {loading ? <Loader /> : "Send OTP"}
        </button>
        <p style={{ marginTop: "16px", fontSize: "14px" }} className="auth-link-text">
          New user? <a href="/signup">Sign up</a>
        </p>
        <p style={{ marginTop: "8px", fontSize: "12px", opacity: 0.7 }} className="auth-hint">
          💡 If OTP doesn't arrive, check the backend console
        </p>
      </div>
    </div>
  );
}
