import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";
import Loader from "../components/Loader";
import "../styles/auth.css";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const phone = localStorage.getItem("tempPhone");

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    if (!phone) {
      setError("Phone number not found. Please try again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = phone.replace(/\s|-|\(|\)/g, "");
      
      const res = await authService.verifyOTP(cleanPhone, otp.trim());
      if (res.data.success) {
        if (res.data.needsProfileCompletion) {
          // Profile incomplete - store temp token and redirect to profile completion
          localStorage.setItem("tempToken", res.data.tempToken);
          localStorage.setItem("tempPhone", cleanPhone);
          navigate("/complete-profile");
        } else {
          // Profile complete - store full token and redirect to dashboard
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.removeItem("tempToken");
          localStorage.removeItem("tempPhone");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Verify Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid OTP";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2>Enter OTP</h2>
        <p>OTP sent to <strong>{phone}</strong></p>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
          maxLength="6"
        />
        {error && (
          <div className="error-message" style={{ marginTop: "12px", color: "var(--error-color)", fontSize: "14px" }}>
            {error}
          </div>
        )}
        <button onClick={verifyOtp} disabled={loading || otp.length !== 6}>
          {loading ? <Loader /> : "Verify"}
        </button>
        {phone && (
          <p style={{ marginTop: "12px", fontSize: "14px" }} className="auth-link-text">
            Wrong number? <a href="/login">Change</a>
          </p>
        )}
      </div>
    </div>
  );
}
