// src/module-1/home/components/HeroSection.tsx
import React from 'react';
import '../styles/HeroSection.css'; // Import the CSS file relative to its location

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      {/* Main Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1>Streamline Your Business with Anybill</h1>
          <p>The smartest way to manage billing, inventory, and accounting for small businesses.</p>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span>Create professional invoices in seconds</span>
            </div>
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span>Automate GST compliance effortlessly</span>
            </div>
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span>Track sales, stock, and payments in one place</span>
            </div>
          </div>
          <div className="cta-buttons">
            <button className="btn-primary">Start Free Billing →</button>
            <button className="btn-secondary">Book Free Demo</button>
          </div>
        </div>

        {/* Animated Illustration Placeholder */}
        <div className="hero-illustration">
          <div className="animated-shape shape-1"></div>
          <div className="animated-shape shape-2"></div>
          <div className="animated-shape shape-3"></div>
          <div className="illustration-content">
            <h3>Anybill Product Tour</h3>
            <p>See how Anybill can transform your business operations.</p>
            <button className="play-button">Watch Now</button>
          </div>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
    </section>
  );
};

export default HeroSection;