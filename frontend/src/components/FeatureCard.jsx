import React from "react";
import "../styles/featurecard.css";

export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="feature-card card">
      <div className="feature-top">
        <div className="feature-icon">{icon}</div>
        <h3 className="feature-title">{title}</h3>
      </div>
      <p className="feature-desc">{description}</p>
    </div>
  );
}
