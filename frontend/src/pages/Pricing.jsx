import React from "react";
import { Link } from "react-router-dom";
import "../styles/pricing.css";

export default function Pricing() {
  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <h1 className="page-title">Simple, Transparent Pricing</h1>
          <p className="page-subtitle">
            Choose the perfect plan for your business. Start free and upgrade as you grow. 
            No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            
            {/* Basic Plan */}
            <div className="plan-card">
              <div className="plan-header">
                <h3 className="plan-name">Basic</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">0</span>
                  <span className="period">/month</span>
                </div>
                <p className="plan-description">Perfect for getting started</p>
              </div>
              <div className="plan-features">
                <ul>
                  <li><span className="check">✓</span> Up to 50 invoices/month</li>
                  <li><span className="check">✓</span> 2 users included</li>
                  <li><span className="check">✓</span> Basic invoice templates</li>
                  <li><span className="check">✓</span> GST compliance</li>
                  <li><span className="check">✓</span> Customer management</li>
                  <li><span className="check">✓</span> Email support</li>
                  <li><span className="check">✓</span> Cloud backup</li>
                  <li className="disabled"><span className="cross">✗</span> Inventory management</li>
                  <li className="disabled"><span className="cross">✗</span> Advanced reports</li>
                  <li className="disabled"><span className="cross">✗</span> WhatsApp sharing</li>
                </ul>
              </div>
              <div className="plan-action">
                <Link to="/signup" className="btn btn-outline btn-full">
                  Start Free
                </Link>
              </div>
            </div>

            {/* Premium Plan - Popular */}
            <div className="plan-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="plan-header">
                <h3 className="plan-name">Premium</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">499</span>
                  <span className="period">/month</span>
                </div>
                <p className="plan-description">For growing businesses</p>
              </div>
              <div className="plan-features">
                <ul>
                  <li><span className="check">✓</span> Unlimited invoices</li>
                  <li><span className="check">✓</span> 5 users included</li>
                  <li><span className="check">✓</span> All invoice templates</li>
                  <li><span className="check">✓</span> GST compliance</li>
                  <li><span className="check">✓</span> Full inventory management</li>
                  <li><span className="check">✓</span> Advanced analytics & reports</li>
                  <li><span className="check">✓</span> WhatsApp invoice sharing</li>
                  <li><span className="check">✓</span> Payment tracking</li>
                  <li><span className="check">✓</span> Expense management</li>
                  <li><span className="check">✓</span> Priority support (24/7)</li>
                </ul>
              </div>
              <div className="plan-action">
                <Link to="/signup" className="btn btn-primary btn-full">
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="plan-card">
              <div className="plan-header">
                <h3 className="plan-name">Enterprise</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">1,499</span>
                  <span className="period">/month</span>
                </div>
                <p className="plan-description">For large teams & enterprises</p>
              </div>
              <div className="plan-features">
                <ul>
                  <li><span className="check">✓</span> Everything in Premium</li>
                  <li><span className="check">✓</span> Unlimited users</li>
                  <li><span className="check">✓</span> Multi-warehouse management</li>
                  <li><span className="check">✓</span> Custom invoice branding</li>
                  <li><span className="check">✓</span> API access</li>
                  <li><span className="check">✓</span> Advanced user roles & permissions</li>
                  <li><span className="check">✓</span> Bulk import/export</li>
                  <li><span className="check">✓</span> Recurring billing automation</li>
                  <li><span className="check">✓</span> Dedicated account manager</li>
                  <li><span className="check">✓</span> Custom integrations</li>
                </ul>
              </div>
              <div className="plan-action">
                <Link to="/contact" className="btn btn-outline btn-full">
                  Contact Sales
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="pricing-faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>Yes! Premium and Enterprise plans come with a 30-day free trial. No credit card required.</p>
            </div>
            <div className="faq-item">
              <h4>Can I upgrade or downgrade anytime?</h4>
              <p>Absolutely! You can change your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, debit cards, UPI, net banking, and wallets.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data secure?</h4>
              <p>Yes! We use bank-level encryption and secure cloud servers. Your data is backed up daily.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer discounts for annual plans?</h4>
              <p>Yes! Get 20% off when you choose annual billing. Contact us for custom enterprise pricing.</p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Yes, you can cancel your subscription anytime. No questions asked, no cancellation fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pricing-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Still Have Questions?</h2>
            <p>Our team is here to help you choose the right plan for your business.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">Talk to Sales</Link>
              <Link to="/signup" className="btn btn-outline btn-large">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
