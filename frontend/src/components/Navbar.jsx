import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/navbar.css";

export default function Navbar() {
  const loc = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="nav-wrap">
      <div className="nav container">
        <div className="nav-left">
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brand-logo">MyBillPro</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Desktop navigation */}
        <nav className="nav-center">
          <Link className={loc.pathname === "/" ? "nav-link active" : "nav-link"} to="/" onClick={closeMenu}>Home</Link>
          <Link className={loc.pathname.startsWith("/features") ? "nav-link active" : "nav-link"} to="/features" onClick={closeMenu}>Features</Link>
          <Link className={loc.pathname === "/pricing" ? "nav-link active" : "nav-link"} to="/pricing" onClick={closeMenu}>Pricing</Link>
          <Link className={loc.pathname === "/about" ? "nav-link active" : "nav-link"} to="/about" onClick={closeMenu}>About</Link>
          <Link className={loc.pathname === "/faq" ? "nav-link active" : "nav-link"} to="/faq" onClick={closeMenu}>FAQ</Link>
        </nav>

        <div className="nav-right">
          <ThemeToggle className="theme-toggle-nav" />
          <Link className="btn btn-outline" to="/login" onClick={closeMenu}>Login</Link>
          <Link className="btn btn-primary" to="/signup" onClick={closeMenu}>Get Started</Link>
        </div>

        {/* Mobile navigation */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <Link className={loc.pathname === "/" ? "nav-link active" : "nav-link"} to="/" onClick={closeMenu}>Home</Link>
            <Link className={loc.pathname.startsWith("/features") ? "nav-link active" : "nav-link"} to="/features" onClick={closeMenu}>Features</Link>
            <Link className={loc.pathname === "/pricing" ? "nav-link active" : "nav-link"} to="/pricing" onClick={closeMenu}>Pricing</Link>
            <Link className={loc.pathname === "/about" ? "nav-link active" : "nav-link"} to="/about" onClick={closeMenu}>About</Link>
            <Link className={loc.pathname === "/faq" ? "nav-link active" : "nav-link"} to="/faq" onClick={closeMenu}>FAQ</Link>
          </nav>
          
          <div className="mobile-actions">
            <ThemeToggle className="theme-toggle-nav" />
            <Link className="btn btn-outline" to="/login" onClick={closeMenu}>Login</Link>
            <Link className="btn btn-primary" to="/signup" onClick={closeMenu}>Get Started</Link>
          </div>
        </div>
      </div>
    </header>
  );
}