// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Module 1: Public Pages
import Navbar from './module-1/home/components/Navbar';
import Footer from './module-1/home/components/Footer';
import HeroSection from './module-1/home/components/HeroSection';
import SectionOne from './module-1/home/components/SectionOne';
import FrequentlyAsked from './module-1/home/components/FrequentlyAsked';
import PricingAndFAQ from './module-1/home/components/PricingAndFAQ';

// Module 2: Auth
import AuthFlow from './module-2/components/auth/AuthFlow';

// Module 3: Dashboard
import Dashboard from './module-3/dashboard/components/Dashboard';

// Layouts
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <div className="auth-layout-wrapper" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      {children}
    </div>
    <Footer />
  </>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-wrapper">{children}</div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/auth/mobile" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <>
                  <HeroSection />
                  <SectionOne />
                  <FrequentlyAsked />
                </>
              </PublicLayout>
            }
          />
          <Route
            path="/pricing-faq"
            element={
              <PublicLayout>
                <PricingAndFAQ />
              </PublicLayout>
            }
          />

          {/* Auth Flow */}
          <Route
            path="/auth/*"
            element={
              <AuthLayout>
                <AuthFlow />
              </AuthLayout>
            }
          />

          {/* Redirects */}
          <Route path="/login" element={<Navigate to="/auth/mobile?mode=login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/mobile?mode=register" replace />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;