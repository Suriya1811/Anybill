import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const tempToken = localStorage.getItem("tempToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // If no token at all, redirect to login
  if (!token && !tempToken) {
    return <Navigate to="/login" />;
  }
  
  // If temp token exists, user needs to complete profile
  if (tempToken && !token) {
    return <Navigate to="/complete-profile" />;
  }
  
  // If token exists but user profile incomplete, redirect to complete profile
  if (token && user && !user.isProfileComplete) {
    return <Navigate to="/complete-profile" />;
  }
  
  return children;
}
