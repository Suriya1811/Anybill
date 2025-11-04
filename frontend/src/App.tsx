// src/App.tsx



// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './module-1/home/components/Navbar'; 
import Footer from './module-1/home/components/Footer';
import HeroSection from './module-1/home/components/HeroSection';
import SectionOne from './module-1/home/components/SectionOne';
import FrequentlyAsked from './module-1/home/components/FrequentlyAsked';
import PricingAndFAQ from './module-1/home/components/PricingAndFAQ';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection/>
              <SectionOne/>
              <FrequentlyAsked/>
            </>
          } />
          <Route path="/pricing-faq" element={
            <PricingAndFAQ />
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
