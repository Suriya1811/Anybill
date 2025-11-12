// src/module-1/home/components/SectionOne.tsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/SectionOne.css';

const SectionOne: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      image: "https://via.placeholder.com/600x400?text=Office+Scene",
      heading: "All-in-one billing software to help grow your business 4.2x",
      subheading: "Experience Effortless GST Compliance with myBillBook Invoicing Software"
    },
    {
      image: "https://via.placeholder.com/600x400?text=Warehouse+Scene",
      heading: "Your personal marketing & sales assistant, right in your pocket",
      subheading: "Get more customers, get more from your customers"
    },
    {
      image: "https://via.placeholder.com/600x400?text=On+The+Go+Scene",
      heading: "Streamline Your Business with Anybill",
      subheading: "The smartest way to manage billing, inventory, and accounting for small businesses."
    }
  ];

  // Auto-advance every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine swipe direction
    if (offsetX > 50) {
      goToPrev();
    } else if (offsetX < -50) {
      goToNext();
    }
    
    setOffsetX(0);
  };

  // Mouse handlers (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setOffsetX(currentX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (offsetX > 50) {
      goToPrev();
    } else if (offsetX < -50) {
      goToNext();
    }
    
    setOffsetX(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section className="section-one">
      {/* Decorative Floating Elements */}
      <div className="floating-bg">
        <div className="float-item float-1"></div>
        <div className="float-item float-2"></div>
        <div className="float-item float-3"></div>
      </div>

      <div className="section-wrapper">
        {/* Left: Static Intro Text */}
        <div className="intro-text">
          <h2>Easily run your business</h2>
          <h3>With the Best Billing & Accounting Software</h3>
          <h1>Anytime, Anywhere!</h1>
          <p>Multi-user, multi-device, multi-business functionalities make Anybill billing software a superpower for your business!</p>
        </div>

        {/* Right: Dynamic Content (Image + Overlay Text) */}
        <div 
          className="content-card"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Image Carousel */}
          <div className="image-frame">
            <img
              src={current.image}
              alt={`Slide ${currentSlide + 1}`}
              className="slide-image"
            />
          </div>

          {/* Overlay Text */}
          <div className="overlay-text">
            <h1 className="overlay-heading">{current.heading}</h1>
            <p className="overlay-subheading">{current.subheading}</p>
            <button className="cta-button">Get Started Now →</button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`indicator ${i === currentSlide ? 'active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionOne;