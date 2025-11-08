// src/module-1/home/components/Footer.tsx
import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h3 className="brand-title">Anybill</h3>
          <p className="brand-tagline">Simplify Billing. Grow Your Business.</p>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Information</h4>
            <ul>
              <li><a href="#">Pricing Plans</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Invoice Formats</a></li>
              <li><a href="#">Billing Templates</a></li>
              <li><a href="#">Tax Guide</a></li>
              <li><a href="#">GST Tools</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Software</h4>
            <ul>
              <li><a href="#">Billing Software</a></li>
              <li><a href="#">POS System</a></li>
              <li><a href="#">Inventory Tools</a></li>
              <li><a href="#">e-Invoice Generator</a></li>
              <li><a href="#">Retail Solutions</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Get in Touch</h4>
            <ul>
              <li><a href="mailto:support@flobiz.in">support@flobiz.in</a></li>
              <li><a href="tel:+917400417400">+91 740041 7400</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Anybill — All rights reserved</p>
        <p className="footer-company">Valorem Stack Private Limited</p>
      </div>
    </footer>
  );
};

export default Footer;
