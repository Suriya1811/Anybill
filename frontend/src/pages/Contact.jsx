import React from "react";
import ContactForm from "../components/ContactForm";
import "../styles/contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">
            Have questions? Need help? Our team is here to assist you. 
            Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>Contact Information</h2>
              
              <div className="info-card">
                <div className="info-icon">📧</div>
                <div className="info-content">
                  <h4>Email Support</h4>
                  <p>support@mybillpro.com</p>
                  <p className="info-note">We respond within 24 hours</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h4>Phone Support</h4>
                  <p>+91 9999999999</p>
                  <p className="info-note">Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">💬</div>
                <div className="info-content">
                  <h4>WhatsApp Support</h4>
                  <a href="https://wa.me/919999999999" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                    <span>📱</span> Chat on WhatsApp
                  </a>
                  <p className="info-note">Quick responses via WhatsApp</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🏢</div>
                <div className="info-content">
                  <h4>Office Address</h4>
                  <p>MyBillPro Technologies Pvt. Ltd.</p>
                  <p>123 Business Park, MG Road</p>
                  <p>Bangalore, Karnataka 560001</p>
                  <p>India</p>
                </div>
              </div>

              <div className="social-links">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon">👤 Facebook</a>
                  <a href="#" className="social-icon">🐦 Twitter</a>
                  <a href="#" className="social-icon">💼 LinkedIn</a>
                  <a href="#" className="social-icon">📸 Instagram</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Us on Map</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.7804655920436!2d77.59802631482221!3d12.971598990859858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="support-hours">
        <div className="container">
          <div className="hours-grid">
            <div className="hours-card">
              <div className="hours-icon">⏰</div>
              <h4>Support Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div className="hours-card">
              <div className="hours-icon">⚡</div>
              <h4>Emergency Support</h4>
              <p>Premium & Enterprise customers</p>
              <p>24/7 emergency support available</p>
              <p>Response time: Under 1 hour</p>
            </div>
            <div className="hours-card">
              <div className="hours-icon">📚</div>
              <h4>Help Center</h4>
              <p>Browse our knowledge base</p>
              <p>Video tutorials and guides</p>
              <p><a href="/faq">Visit FAQ Section →</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
