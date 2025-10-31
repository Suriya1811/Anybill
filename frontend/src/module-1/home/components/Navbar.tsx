// src/module-1/home/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css'; // Import the CSS file relative to its location

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // Close menu on window resize if it was open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // Close mobile menu on larger screens
        setActiveDropdown(null); // Close any open dropdowns
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <a href="#" className="logo-link">
            <span className="logo-text">Anybill</span>
          </a>
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
              onClick={(e) => { e.preventDefault(); toggleDropdown('features'); }}
            >
              Features
              <span className={`dropdown-arrow ${activeDropdown === 'features' ? 'rotated' : ''}`}>▼</span>
            </a>
            <div className={`dropdown-menu ${activeDropdown === 'features' ? 'show' : ''}`}>
              <a href="#" className="dropdown-link">Billing</a>
              <a href="#" className="dropdown-link">Inventory</a>
              <a href="#" className="dropdown-link">Accounting</a>
              <a href="#" className="dropdown-link">GST Filing</a>
            </div>
          </li>
          <li className="nav-item dropdown-container">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); toggleDropdown('solutions'); }}
            >
              Solutions
              <span className={`dropdown-arrow ${activeDropdown === 'solutions' ? 'rotated' : ''}`}>▼</span>
            </a>
            <div className={`dropdown-menu ${activeDropdown === 'solutions' ? 'show' : ''}`}>
              <a href="#" className="dropdown-link">For Retailers</a>
              <a href="#" className="dropdown-link">For Wholesalers</a>
              <a href="#" className="dropdown-link">For Manufacturers</a>
              <a href="#" className="dropdown-link">For Service Providers</a>
            </div>
          </li>
          <li className="nav-item dropdown-container">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); toggleDropdown('knowledge'); }}
            >
              Knowledge Centre
              <span className={`dropdown-arrow ${activeDropdown === 'knowledge' ? 'rotated' : ''}`}>▼</span>
            </a>
            <div className={`dropdown-menu ${activeDropdown === 'knowledge' ? 'show' : ''}`}>
              <a href="#" className="dropdown-link">Blog</a>
              <a href="#" className="dropdown-link">Help Center</a>
              <a href="#" className="dropdown-link">FAQs</a>
              <a href="#" className="dropdown-link">Webinars</a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Pricing</a>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="nav-cta-buttons">
          <a href="#" className="nav-link login">Login</a>
          <a href="#" className="nav-link book-demo">Book Free Demo</a>
          <a href="#" className="nav-link start-billing">Start Free Billing</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;