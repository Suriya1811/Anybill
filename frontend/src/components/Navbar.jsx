import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "../styles/navbar.css";

export default function Navbar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="nav-wrap">
      <div className="nav container">
        {/* LEFT — BRAND */}
        <Link to="/" className="brand">
          <span className="brand-logo">MyBillPro</span>
        </Link>

        {/* HAMBURGER (only visible on mobile) */}
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* CENTER LINKS — DESKTOP ONLY */}
        <nav className={`nav-center`}>
          {!isAuthenticated ? (
            <>
              <Link
                className={loc.pathname === "/" ? "nav-link active" : "nav-link"}
                to="/"
              >
                Home
              </Link>
              <Link
                className={
                  loc.pathname.startsWith("/features")
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/features"
              >
                Features
              </Link>
              <Link
                className={
                  loc.pathname === "/pricing" ? "nav-link active" : "nav-link"
                }
                to="/pricing"
              >
                Pricing
              </Link>
              <Link
                className={
                  loc.pathname === "/about" ? "nav-link active" : "nav-link"
                }
                to="/about"
              >
                About
              </Link>
              <Link
                className={
                  loc.pathname === "/faq" ? "nav-link active" : "nav-link"
                }
                to="/faq"
              >
                FAQ
              </Link>
              <Link
                className={
                  loc.pathname === "/contact" ? "nav-link active" : "nav-link"
                }
                to="/contact"
              >
                Contact
              </Link>
            </>
          ) : (
            <>
              <Link
                className={loc.pathname === "/" ? "nav-link active" : "nav-link"}
                to="/"
              >
                Home
              </Link>
              <Link
                className={
                  loc.pathname.startsWith("/dashboard")
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/dashboard"
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT — DESKTOP ONLY */}
        <div className="nav-right">
          <ThemeToggle className="theme-toggle-nav" />

          {!isAuthenticated ? (
            <>
              <Link className="btn btn-outline" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Get Started
              </Link>
            </>
          ) : (
            <button
              className="btn btn-outline"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMenuOpen && (
        <div className={`mobile-menu-dropdown open`}>
          <div className="mobile-menu-content">
            {/* NAV LINKS */}
            {!isAuthenticated ? (
              <>
                <Link
                  className={loc.pathname === "/" ? "nav-link active" : "nav-link"}
                  to="/"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  className={
                    loc.pathname.startsWith("/features")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/features"
                  onClick={closeMenu}
                >
                  Features
                </Link>
                <Link
                  className={
                    loc.pathname === "/pricing" ? "nav-link active" : "nav-link"
                  }
                  to="/pricing"
                  onClick={closeMenu}
                >
                  Pricing
                </Link>
                <Link
                  className={
                    loc.pathname === "/about" ? "nav-link active" : "nav-link"
                  }
                  to="/about"
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link
                  className={loc.pathname === "/faq" ? "nav-link active" : "nav-link"}
                  to="/faq"
                  onClick={closeMenu}
                >
                  FAQ
                </Link>
                <Link
                  className={
                    loc.pathname === "/contact" ? "nav-link active" : "nav-link"
                  }
                  to="/contact"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={loc.pathname === "/" ? "nav-link active" : "nav-link"}
                  to="/"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  className={
                    loc.pathname.startsWith("/dashboard")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* THEME TOGGLE (MOBILE) */}
            <div className="mobile-theme-toggle">
              <ThemeToggle />
            </div>

            {/* BUTTONS (MOBILE) */}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn btn-outline mobile-menu-btn"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="btn btn-primary mobile-menu-btn"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-outline mobile-menu-btn"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
