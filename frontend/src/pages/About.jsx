import React from "react";
import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title">Empowering Small Businesses to Grow</h1>
          <p className="page-subtitle">
            MyBillPro is more than just billing software — it's your trusted partner in business growth. 
            We're on a mission to simplify accounting and help entrepreneurs focus on what they do best.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2 className="section-title">Our Story</h2>
              <p>
                MyBillPro was born from a simple observation: small business owners were spending hours on paperwork instead of growing their business. Complex accounting software, manual calculations, and scattered records were holding them back.
              </p>
              <p>
                We built MyBillPro to change that. A platform so intuitive that anyone can create professional invoices, track inventory, and analyze business performance — all without accounting experience.
              </p>
              <p>
                Today, over 50,000 businesses across India trust MyBillPro to manage their daily operations, from local retailers to growing enterprises. We're proud to be their digital accountant.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">📊</span>
                <p>Business Growth Visual</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To simplify billing and inventory management for every small business in India, 
                making professional accounting accessible to all — regardless of technical expertise or business size.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">🚀</div>
              <h3>Our Vision</h3>
              <p>
                To become India's most trusted business management platform, empowering millions of 
                entrepreneurs to run smarter, faster, and more profitable businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h4>Simplicity First</h4>
              <p>We believe powerful software doesn't have to be complicated. Clean design and intuitive workflows guide every decision we make.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Customer Trust</h4>
              <p>Your business data is sacred. We protect it with bank-level security and never compromise on privacy or reliability.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h4>Speed & Efficiency</h4>
              <p>Time is money. Our platform is built for speed — from lightning-fast invoice generation to real-time reporting.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h4>Continuous Innovation</h4>
              <p>We listen to our users and evolve constantly. Every feature we build solves real problems faced by real businesses.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h4>Exceptional Support</h4>
              <p>We're here when you need us. Our dedicated support team ensures you're never stuck, with 24/7 assistance available.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📈</div>
              <h4>Your Growth is Our Success</h4>
              <p>When your business thrives, we celebrate with you. Your success drives everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Built by Entrepreneurs, for Entrepreneurs</h2>
          <p className="section-subtitle">
            Our team combines deep technology expertise with real-world business experience. 
            We understand the challenges you face because we've been there ourselves.
          </p>
          <div className="team-image">
            <div className="image-placeholder">
              <span className="placeholder-icon">👥</span>
              <p>Team Collaboration Visual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Active Businesses</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Invoices Created</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">4.8/5</div>
              <div className="stat-label">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Join Our Growing Community?</h2>
            <p>Start managing your business smarter today — no credit card required.</p>
            <a href="/signup" className="btn btn-primary btn-large">Start Free Trial</a>
          </div>
        </div>
      </section>
    </div>
  );
}
