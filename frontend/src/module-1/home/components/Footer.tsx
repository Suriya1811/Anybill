// src/module-1/home/components/Footer.tsx
import React from 'react';
import '../styles/Footer.css'; // Import the CSS file relative to its location

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Top Gradient Bar */}
      <div className="gradient-bar">
        <p>Save up to 45% today <a href="#" className="demo-link">Book 1:1 Demo →</a></p>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-column">
          <h3>Get in touch</h3>
          <ul>
            <li><a href="#">Contact us</a></li>
            <li><a href="mailto:support@flobiz.in">support@flobiz.in</a></li>
            <li><a href="tel:+917400417400">+91 740041 7400</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Information</h3>
          <ul>
            <li><a href="#">Pricing Plans</a></li>
            <li><a href="#">Refund Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Lender Partner Details</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Service Pages</a></li>
            <li><a href="#">HTML Sitemap</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Quotation Format</a></li>
            <li><a href="#">Cash Memo Format</a></li>
            <li><a href="#">Debit Note Format</a></li>
            <li><a href="#">Proforma Invoice Format</a></li>
            <li><a href="#">Hotel Bill Format</a></li>
            <li><a href="#">Mobile Shop Bill Format</a></li>
            <li><a href="#">Restaurant Bill Format</a></li>
            <li><a href="#">Medical Bill Format</a></li>
            <li><a href="#">Purchase Order Format</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Software</h3>
          <ul>
            <li><a href="#">Accounting Software</a></li>
            <li><a href="#">Inventory Management Software</a></li>
            <li><a href="#">POS Billing Software</a></li>
            <li><a href="#">E-Invoicing Software</a></li>
            <li><a href="#">e-Way Bill Software</a></li>
            <li><a href="#">Restaurant Billing Software</a></li>
            <li><a href="#">Billing Software For Retail Shop</a></li>
            <li><a href="#">Medical Billing Software</a></li>
            <li><a href="#">Hotel Billing Software</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>GST Articles</h3>
          <ul>
            <li><a href="#">GST Invoice</a></li>
            <li><a href="#">All About GST</a></li>
            <li><a href="#">Know About HSN Code</a></li>
            <li><a href="#">Delivery Challan</a></li>
            <li><a href="#">Credit Note</a></li>
            <li><a href="#">e Invoice</a></li>
            <li><a href="#">eWay Bill</a></li>
            <li><a href="#">Close The Financial Year in myBillBook</a></li>
            <li><a href="#">Create e-invoice Using myBillBook</a></li>
          </ul>
        </div>

        <div className="footer-column social">
          <h3>Follow us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon youtube"><span>YouTube</span></a>
            <a href="#" className="social-icon facebook"><span>Facebook</span></a>
            <a href="#" className="social-icon instagram"><span>Instagram</span></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>Valorem Stack Private Limited</p>
        <p>&copy; {new Date().getFullYear()} Anybill. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;