// src/module-1/home/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle dropdown for a specific item
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu & dropdowns on resize (desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for user in localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/">
            <span className="logo-text">Anybill</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item dropdown-container">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('features');
              }}
            >
              Features
              <span className={`dropdown-arrow ${activeDropdown === 'features' ? 'rotated' : ''}`}>▼</span>
            </a>
            <div className={`dropdown-menu ${activeDropdown === 'features' ? 'show' : ''}`}>
              <Link to="/gst-bill" className="dropdown-link">GST Billing & Invoicing</Link>
              <Link to="/features/inventory-management" className="dropdown-link">Inventory Management</Link>
              <Link to="/features/bookkeeping" className="dropdown-link">Bookkeeping</Link>
              <Link to="/features/pos-billing" className="dropdown-link">POS Billing</Link>
              <Link to="/features/business-marketing" className="dropdown-link">Business Marketing</Link>
              <Link to="/features/eway-billing" className="dropdown-link">eWay Billing</Link>
              <Link to="/features/einvoicing" className="dropdown-link">eInvoicing</Link>
            </div>
          </li>

          <li className="nav-item dropdown-container">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('solutions');
              }}
            >
              Solutions
              <span className={`dropdown-arrow ${activeDropdown === 'solutions' ? 'rotated' : ''}`}>▼</span>
            </a>
            <div className={`dropdown-menu solutions-dropdown ${activeDropdown === 'solutions' ? 'show' : ''}`}>
              <div className="solutions-columns">
                <div className="column">
                  <h4>Industry Type</h4>
                  <Link to="/solutions/retail" className="dropdown-link">Retail</Link>
                  <Link to="/solutions/distribution" className="dropdown-link">Distribution</Link>
                  <Link to="/solutions/wholesale" className="dropdown-link">Wholesale</Link>
                  <Link to="/solutions/manufacturing" className="dropdown-link">Manufacturing</Link>
                  <Link to="/solutions/service-based" className="dropdown-link">Service-Based</Link>
                </div>
                <div className="column">
                  <h4>Sectors</h4>
                  <Link to="/solutions/restaurants" className="dropdown-link">Restaurants</Link>
                  <Link to="/solutions/hotel" className="dropdown-link">Hotel</Link>
                  <Link to="/solutions/pharmacy" className="dropdown-link">Pharmacy</Link>
                  <Link to="/solutions/fmcg" className="dropdown-link">FMCG</Link>
                  <Link to="/solutions/textile" className="dropdown-link">Textile</Link>
                  <Link to="/solutions/electronics" className="dropdown-link">Electronics</Link>
                </div>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown-container">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown('knowledge');
              }}
            >
              Knowledge Centre
              <span className={`dropdown-arrow ${activeDropdown === 'knowledge' ? 'rotated' : ''}`}>▼</span>
            </a>
            <div className={`dropdown-menu ${activeDropdown === 'knowledge' ? 'show' : ''}`}>
              <Link to="/blog" className="dropdown-link">Blog</Link>
              <Link to="/help-center" className="dropdown-link">Help Center</Link>
              <Link to="/faq" className="dropdown-link">FAQs</Link>
              <Link to="/webinars" className="dropdown-link">Webinars</Link>
            </div>
          </li>

          <li className="nav-item">
            <Link to="/pricing-faq" className="nav-link">Pricing & FAQ</Link>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="nav-cta-buttons">
          {user ? (
            // User is logged in - show profile menu
            <div className="user-profile-menu">
              <div className="user-greeting">
                Hi, {user.name || user.businessName || 'User'}!
              </div>
              <div className="user-actions">
                <Link to="/dashboard" className="nav-link dashboard">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="nav-link logout">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // User not logged in - show login/register
            <>
              <Link to="/auth/mobile?mode=login" className="nav-link login">
                Login
              </Link>
              <Link to="/auth/mobile?mode=register" className="nav-link register">
                Register
              </Link>
            </>
          )}
          <Link to="/book-demo" className="nav-link book-demo">
            Book Free Demo
          </Link>
          <Link to="/start-billing" className="nav-link start-billing">
            Start Free Billing
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;