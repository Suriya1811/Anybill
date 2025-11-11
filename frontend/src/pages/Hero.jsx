import React from "react";
import { Link } from "react-router-dom";
import "../styles/hero.css";
import CTA from "../components/CTA";
import heroImage from "../assets/images/hero-image.jpg";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-left">
          <h1 className="hero-title">Billing that's fast, simple & beautiful</h1>
          <p className="hero-sub">Create GST-ready invoices, track payments, manage stock — all in one place. Mobile-first & secure.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/signup">Start Free</Link>
            <Link className="btn btn-outline" to="/features">Explore features</Link>
          </div>
          <div className="trust">
            <span className="chip">Trusted by 10,000+ businesses</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-container">
            <img src={heroImage} alt="MyBillPro Dashboard" className="hero-image" />
          </div>
        </div>
      </div>
      <CTA />
    </section>
  );
}