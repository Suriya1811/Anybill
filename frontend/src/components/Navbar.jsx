import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/navbar.css";

export default function Navbar() {
  const loc = useLocation();
  
  return (
    <header className="nav-wrap">
      <div className="nav container">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span className="brand-logo">MyBillPro</span>
          </Link>
        </div>

        <nav className="nav-center">
          <Link className={loc.pathname === "/" ? "nav-link active" : "nav-link"} to="/">Home</Link>
          <Link className={loc.pathname.startsWith("/features") ? "nav-link active" : "nav-link"} to="/features">Features</Link>
          <Link className={loc.pathname === "/pricing" ? "nav-link active" : "nav-link"} to="/pricing">Pricing</Link>
          <Link className={loc.pathname === "/about" ? "nav-link active" : "nav-link"} to="/about">About</Link>
          <Link className={loc.pathname === "/faq" ? "nav-link active" : "nav-link"} to="/faq">FAQ</Link>
        </nav>

        <div className="nav-right">
          <ThemeToggle className="theme-toggle-nav" />
          <Link className="btn btn-outline" to="/login">Login</Link>
          <Link className="btn btn-primary" to="/signup">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
