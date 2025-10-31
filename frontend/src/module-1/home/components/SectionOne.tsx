// src/module-1/home/components/SectionOne.tsx
import React, { useState, useEffect } from 'react';
import '../styles/SectionOne.css'; // Import the CSS file relative to its location

const SectionOne: React.FC = () => {
  // State for Image Carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://via.placeholder.com/500x300?text=Office+Scene",
    "https://via.placeholder.com/500x300?text=Warehouse+Scene",
    "https://via.placeholder.com/500x300?text=On+The+Go+Scene"
  ];

  // State for Dynamic Text
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
    {
      heading: "All-in-one billing software to help grow your business 4.2x",
      subheading: "Experience Effortless GST Compliance with myBillBook Invoicing Software"
    },
    {
      heading: "Your personal marketing & sales assistant, right in your pocket - Billing software with marketing capabilities",
      subheading: "Get more customers, get more from your customers"
    },
    {
      heading: "Streamline Your Business with Anybill",
      subheading: "The smartest way to manage billing, inventory, and accounting for small businesses."
    }
  ];

  // Auto-scroll images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Auto-scroll text every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [texts.length]);

  // Handle manual navigation for images
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="section-one">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="background-element element-1"></div>
        <div className="background-element element-2"></div>
        <div className="background-element element-3"></div>
      </div>

      {/* Main Content */}
      <div className="section-content">
        {/* Left Side Text */}
        <div className="section-text">
          <h2>Easily run your business</h2>
          <h3>With the Best Billing & Accounting Software</h3>
          <h1>Anytime, Anywhere!</h1>
          <p>Multi-user, multi-device, multi-business functionalities make Anybill billing software a superpower for your business!</p>
        </div>

        {/* Right Side Image Carousel */}
        <div className="image-carousel">
          <div className="carousel-container">
            <div className="carousel-slides" style={{ transform: `translateY(-${currentImageIndex * 100}%)` }}>
              {images.map((img, index) => (
                <div key={index} className="carousel-slide">
                  <img src={img} alt={`Image ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="carousel-controls">
              <button onClick={goToPrevious} className="control-button prev">←</button>
              <button onClick={goToNext} className="control-button next">→</button>
            </div>
          </div>
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Text Overlay (Overlapping the image area) */}
      <div className="dynamic-text-overlay">
        <div className="text-container">
          <h1 className={`main-heading ${currentTextIndex === 0 ? 'active' : ''}`}>
            {texts[0].heading}
          </h1>
          <h2 className={`sub-heading ${currentTextIndex === 0 ? 'active' : ''}`}>
            {texts[0].subheading}
          </h2>
          <h1 className={`main-heading ${currentTextIndex === 1 ? 'active' : ''}`}>
            {texts[1].heading}
          </h1>
          <h2 className={`sub-heading ${currentTextIndex === 1 ? 'active' : ''}`}>
            {texts[1].subheading}
          </h2>
          <h1 className={`main-heading ${currentTextIndex === 2 ? 'active' : ''}`}>
            {texts[2].heading}
          </h1>
          <h2 className={`sub-heading ${currentTextIndex === 2 ? 'active' : ''}`}>
            {texts[2].subheading}
          </h2>
        </div>
        <button className="btn-primary">Get Started Now →</button>
      </div>
    </section>
  );
};

export default SectionOne;