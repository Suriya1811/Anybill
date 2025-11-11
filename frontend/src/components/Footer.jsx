import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <div className="footer-title">MyBillPro</div>
          <div className="footer-desc">Simple, fast & reliable billing for small businesses.</div>
        </div>

        <div className="footer-links" aria-label="Footer navigation">
          <div><Link to="/features">Features</Link></div>
          <div><Link to="/pricing">Pricing</Link></div>
          <div><Link to="/faq">FAQ</Link></div>
          <div><Link to="/about">About</Link></div>
          <div><Link to="/contact">Contact</Link></div>
        </div>

        <div className="footer-right">
          <div className="copyright">© {new Date().getFullYear()} MyBillPro. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
