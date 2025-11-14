import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/apiService";
import Loader from "../components/Loader";
import "../styles/auth.css";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const phone = localStorage.getItem("tempPhone");

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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
    setSuccessMessage("");
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
          // Profile complete - use AuthContext login
          login(res.data.token, res.data.user);
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

  const resendOtp = async () => {
    if (!canResend) return;
    
    if (!phone) {
      setError("Phone number not found. Please try again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setResending(true);
    setError("");
    setSuccessMessage("");
    try {
      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = phone.replace(/\s|-|\(|\)/g, "");
      
      const res = await authService.sendOTP(cleanPhone);
      if (res.data.success) {
        setSuccessMessage("OTP resent successfully!");
        setTimer(60);
        setCanResend(false);
        setOtp(""); // Clear previous OTP input
        console.log("⚠️ Check backend console for OTP if Twilio is not configured");
      }
    } catch (err) {
      console.error("Resend Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to resend OTP";
      setError(errorMessage);
    } finally {
      setResending(false);
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
            setSuccessMessage("");
          }}
          onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
          maxLength="6"
        />
        {error && (
          <div className="error-message" style={{ marginTop: "12px", color: "var(--error-color)", fontSize: "14px" }}>
            {error}
          </div>
        )}
        {successMessage && (
          <div className="success-message" style={{ marginTop: "12px", color: "var(--success-color)", fontSize: "14px" }}>
            {successMessage}
          </div>
        )}
        <button onClick={verifyOtp} disabled={loading || otp.length !== 6}>
          {loading ? <Loader /> : "Verify"}
        </button>
        
        
        {/* Resend OTP Section */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {canResend ? (
            <button 
              onClick={resendOtp} 
              disabled={resending}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                fontWeight: "600",
                opacity: resending ? 0.6 : 1
              }}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p style={{ 
              fontSize: "14px", 
              color: "var(--text-secondary)", 
              margin: 0,
              padding: "12px",
              background: "var(--bg-secondary)",
              borderRadius: "6px"
            }}>
              Resend OTP in <strong style={{ color: "var(--primary-color)" }}>{timer}s</strong>
            </p>
          )}
        </div>

        {phone && (
          <p style={{ marginTop: "12px", fontSize: "14px" }} className="auth-link-text">
            Wrong number? <a href="/login">Change</a>
          </p>
        )}
      </div>
    </div>
  );
}
