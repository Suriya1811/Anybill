import React from "react";
import { Link } from "react-router-dom";
import "../styles/hero.css";
import heroImage from "../img.jpg";

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left">
            <div className="chip">
              <span>🚀</span>
              <span>Trusted by 50,000+ Businesses</span>
            </div>
            <h1 className="hero-title">Simplify Your Business Billing with Ease</h1>
            <p className="hero-sub">
              The all-in-one billing and inventory management platform. Create professional invoices in seconds, track payments, manage stock, and analyze your business performance in real time.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/signup">Start Free Trial</Link>
              <Link className="btn btn-outline" to="/features">Explore Features</Link>
            </div>
            <div className="trust-badges">
              <span className="badge">✓ No Credit Card Required</span>
              <span className="badge">✓ 24/7 Support</span>
              <span className="badge">✓ Secure Cloud Backup</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-container">
              <img 
                src={heroImage} 
                alt="MyBillPro Dashboard Preview" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">Your Digital Accountant</h2>
            <p className="section-subtitle">
              Designed for small businesses, wholesalers, retailers, and freelancers. Our user-friendly software makes it simple to handle everything from GST/non-GST invoicing to inventory control, sales reports, and WhatsApp sharing.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Active Businesses</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Invoices Generated</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime Guaranteed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="home-features">
        <div className="container">
          <h2 className="section-title">Everything Your Business Needs</h2>
          <p className="section-subtitle">Powerful features that save time, reduce errors, and boost profits</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📄</div>
              <h3>Professional Invoicing</h3>
              <p>Create GST/non-GST invoices in one click with customizable templates</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📦</div>
              <h3>Inventory Management</h3>
              <p>Track stock levels with low-stock alerts and automated reordering</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>Payment Tracking</h3>
              <p>Monitor payments, send reminders, and manage outstanding balances</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h3>Real-Time Reports</h3>
              <p>Profit & loss insights, sales analytics, and tax calculations</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">☁️</div>
              <h3>Cloud Backup</h3>
              <p>Your data stays safe and accessible anytime, anywhere</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>GST Compliance</h3>
              <p>Automatic tax calculations and GSTR reports</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Mobile App</h3>
              <p>Manage your business on the go from any device</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why Businesses Choose MyBillPro</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Save Time</h3>
              <p>Generate professional invoices in seconds, not hours. Automate repetitive tasks and focus on growing your business.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✅</div>
              <h3>Reduce Errors</h3>
              <p>Automatic calculations eliminate manual mistakes. Never worry about incorrect totals or tax amounts again.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Boost Profits</h3>
              <p>Real-time insights help you make smarter decisions. Track what's working and optimize your business strategy.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Bank-Level Security</h3>
              <p>Your data is protected with enterprise-grade encryption. Secure cloud backup ensures you never lose important information.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👤</div>
              <h3>No Accounting Experience Needed</h3>
              <p>Clean, intuitive interface that anyone can use. Start creating invoices within minutes of signing up.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌐</div>
              <h3>Access Anywhere</h3>
              <p>Work from office, home, or on the go. Your business data syncs across all devices in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="target-audience">
        <div className="container">
          <h2 className="section-title">Perfect for All Types of Businesses</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">🏪</div>
              <h3>Retailers</h3>
              <p>Manage sales, inventory, and customer data seamlessly</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🏭</div>
              <h3>Wholesalers</h3>
              <p>Handle bulk orders and B2B invoicing with ease</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">💼</div>
              <h3>Service Providers</h3>
              <p>Professional invoicing for consultants and agencies</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🛠️</div>
              <h3>Manufacturers</h3>
              <p>Track production, raw materials, and finished goods</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">📝</div>
              <h3>Freelancers</h3>
              <p>Simple billing for independent professionals</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🏢</div>
              <h3>SME Businesses</h3>
              <p>Scale your operations with enterprise features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Loved by Thousands of Users</h2>
          <p className="section-subtitle">See why businesses trust MyBillPro as their digital accountant</p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "MyBillPro has completely transformed how I manage my retail store. Creating invoices is now a matter of seconds, and the inventory alerts have saved me from stockouts multiple times!"
              </p>
              <div className="testimonial-author">
                <div className="author-name">Rajesh Kumar</div>
                <div className="author-role">Retail Store Owner, Mumbai</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "As a freelancer, I needed something simple yet professional. This software is perfect! It makes it so easy to create and send invoices to clients instantly."
              </p>
              <div className="testimonial-author">
                <div className="author-name">Priya Sharma</div>
                <div className="author-role">Freelance Designer, Bangalore</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The GST compliance features are excellent. Automatic tax calculations and GSTR reports have made my life so much easier. Highly recommended for any business!"
              </p>
              <div className="testimonial-author">
                <div className="author-name">Amit Patel</div>
                <div className="author-role">Wholesale Distributor, Delhi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Take Your Business to the Next Level</h2>
            <p className="cta-subtitle">
              Join thousands of businesses who trust MyBillPro to run their operations smarter and faster. Start for free today — no credit card required.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                Start Free Trial
              </Link>
              <Link to="/contact" className="btn btn-outline btn-large">
                Talk to Sales
              </Link>
            </div>
            <p className="cta-note">Free forever for up to 10 invoices/month • Upgrade anytime</p>
          </div>
        </div>
      </section>
    </>
  );
}
