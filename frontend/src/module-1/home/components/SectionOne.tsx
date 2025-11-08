// src/module-1/home/components/SectionOne.tsx
import React, { useState, useEffect } from "react";
import "../styles/SectionOne.css";

// Import local images
import b1 from "../../../assets/b1.jpg";
import b2 from "../../../assets/b2.jpg";
import b3 from "../../../assets/b3.jpg";
import b4 from "../../../assets/b4.jpg";

const slides = [
  {
    key: "analytics",
    heading: "Real-Time Analytics",
    content:
      "Get instant insights into your business performance with live financial dashboards and metrics.",
    image: b1,
  },
  {
    key: "invoicing",
    heading: "Smart Invoicing",
    content:
      "Generate professional invoices, track payments, and manage clients with ease using Anybill.",
    image: b2,
  },
  {
    key: "inventory",
    heading: "Inventory Management",
    content:
      "Stay on top of your stock, suppliers, and order fulfillment with our integrated inventory system.",
    image: b3,
  },
  {
    key: "automation",
    heading: "Workflow Automation",
    content:
      "Automate your billing operations and focus more on growing your business — Anybill does the rest.",
    image: b4,
  },
];

const SectionOne: React.FC = () => {
  const [active, setActive] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-one">
      <div className="carousel-container">
        {/* Left Menu */}
        <ul className="carousel-menu">
          {slides.map((slide, index) => (
            <li
              key={slide.key}
              className={`menu-item ${active === index ? "active" : ""}`}
              onClick={() => setActive(index)}
            >
              {slide.heading}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="divider" />

        {/* Right Content */}
        <div className="carousel-content">
          <div className="content-image">
            <img
              src={slides[active].image}
              alt={slides[active].heading}
              className="fade-in"
            />
          </div>
          <div className="content-text">
            <h2>{slides[active].heading}</h2>
            <p>{slides[active].content}</p>
            <button className="cta-btn">Learn More →</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
