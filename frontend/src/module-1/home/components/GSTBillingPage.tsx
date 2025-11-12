// src/module-1/home/components/GSTBillingPage.tsx
import React from 'react';
import styles from '../styles/GSTBillingPage.module.css';

const GSTBillingPage: React.FC = () => {
  const features = [
    {
      icon: '📄',
      title: 'Auto GST Invoicing',
      desc: 'Generate 100% GST-compliant invoices with HSN codes, tax breakup, and e-way bill support.',
    },
    {
      icon: '📤',
      title: 'GSTR-1 & GSTR-3B Filing',
      desc: 'Pre-filled, error-checked returns submitted in minutes.',
    },
    {
      icon: '🔄',
      title: 'ITC Reconciliation',
      desc: 'Auto-match purchase data with GSTR-2B for seamless credit claims.',
    },
    {
      icon: '📊',
      title: 'Live Dashboard',
      desc: 'Track liabilities, refunds, and due dates in real time.',
    },
    {
      icon: '✉️',
      title: 'E-Invoicing (IRN)',
      desc: 'Generate IRN and QR codes instantly via IRP integration.',
    },
    {
      icon: '📱',
      title: 'Cross-Platform Sync',
      desc: 'Access your data seamlessly on web and mobile.',
    },
  ];

  const steps = [
    { step: 1, title: 'Sign Up', desc: 'Create your free account in 30 seconds.' },
    { step: 2, title: 'Connect Data', desc: 'Link your books or upload past invoices.' },
    { step: 3, title: 'Auto-Bill & File', desc: 'System handles billing and filing.' },
    { step: 4, title: 'Stay Compliant', desc: 'Get deadline alerts and audit support.' },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.section}>
        <div className={styles.hero}>
          <h1>
            Simplify Your <span>GST Billing</span> & Compliance
          </h1>
          <p>
            All-in-one platform for Indian businesses: auto-invoicing, GSTR filing, e-way bills, and real-time tax reconciliation.
          </p>
          <button className={styles.btn}>Get Started Free</button>
        </div>
      </div>

      {/* Features */}
      <div className={styles.featuresBg}>
        <div className={styles.section}>
          <h2 className={styles.featuresTitle}>Powerful GST Services</h2>
          <div className={styles.cards}>
            {features.map((f, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className={styles.section}>
        <h2 className={styles.timelineTitle}>How It Works</h2>
        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineDot}>{step.step}</div>
              <div className={styles.timelineContent}>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className={styles.cta}>
        <h2>Ready to Simplify GST?</h2>
        <p>Join thousands of businesses saving 10+ hours every month on tax compliance.</p>
        <button className={styles.btn}>Start Your Free Trial</button>
      </div>
    </div>
  );
};

export default GSTBillingPage;