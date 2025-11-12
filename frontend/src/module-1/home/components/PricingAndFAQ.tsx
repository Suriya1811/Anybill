// src/module-1/home/components/PricingAndFAQ.tsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/PricingAndFAQ.css';

const PricingAndFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pricing plans data
  const pricingPlans = [
    {
      name: "Silver",
      price: "₹499",
      period: "/Year",
      features: [
        "Custom Invoice Themes",
        "Create your Online Store",
        "Generate, print (A4 printer) & scan barcode"
      ],
      isPopular: false,
      color: "#8BC34A"
    },
    {
      name: "Diamond",
      price: "₹999",
      period: "/Year",
      features: [
        "Desktop App",
        "SMS + Whatsapp marketing (500 messages/Year)",
        "E-Way Bills (50/Year)",
        "Staff Attendance & Payroll",
        "Godowns (Unlimited)",
        "Print Barcode (Label printer)",
        "Bulk Download & Bulk Print Invoices"
      ],
      isPopular: true,
      color: "#2196F3"
    },
    {
      name: "Platinum",
      price: "₹1,999",
      period: "/Year",
      features: [
        "E-Way Bills (Unlimited)",
        "Generate e-Invoicing",
        "Loyalty & Rewards",
        "Automate Recurring Billing",
        "POS Billing (Desktop App, Web app)",
        "Data Export to tally (on request)",
        "User Activity Tracker"
      ],
      isPopular: false,
      color: "#9C27B0"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Is myBillBook available on a monthly subscription?",
      answer: "We are currently offering plans on an annual subscription basis."
    },
    {
      question: "What is the price of myBillBook billing software?",
      answer: "myBillBook offers different plans to suit businesses of different sizes. Do check our <a href='/pricing' style='color:#8BC34A; text-decoration:underline;'>Pricing Page</a> to know all the plans available."
    },
    {
      question: "Can I have a free trial of myBillBook app?",
      answer: "Yes, if you haven't used your mobile number to register with the myBillBook billing app, you can enjoy a free trial."
    },
    {
      question: "Can I customize myBillBook subscription plans?",
      answer: "Yes, you can contact our customer service team to get tailor-made subscription plans based on your business needs."
    },
    {
      question: "What payment methods are accepted by myBillBook?",
      answer: "We accept all major credit/debit cards, UPI payments, net banking, and online wallets for your convenience."
    },
    {
      question: "I'm currently opting for a basic plan. Can I change my plan later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Your changes will be reflected in your next billing cycle."
    },
    {
      question: "Are there any discounts for long-term subscriptions?",
      answer: "Yes, we offer significant savings on annual and multi-year subscriptions. Save up to 35% when you commit to longer terms."
    },
    {
      question: "What is the billing cycle of myBillBook?",
      answer: "Billing cycles are annual for most plans. You'll receive renewal notifications before your subscription ends, giving you ample time to renew or modify your plan."
    }
  ];

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = containerRef.current?.querySelectorAll('.faq-card, .pricing-plan');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pricing-faq-section" ref={containerRef}>
      {/* Pricing Section */}
      <div className="pricing-header">
        <h2>Choose Your Plan</h2>
        <p>Select the perfect plan for your business needs</p>
        
        {/* Save banner */}
        <div className="save-banner">
          <div className="save-badge">SAVE UPTO 35%</div>
          <div className="save-text">Save more on 1+ year plans</div>
          <button className="talk-to-sales">Talk to Sales</button>
        </div>
      </div>

      <div className="pricing-container">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`pricing-plan ${plan.isPopular ? 'popular' : ''}`}
            style={{ borderColor: plan.color }}
          >
            {plan.isPopular && (
              <div className="popular-tag" style={{ backgroundColor: plan.color }}>
                Most Popular
              </div>
            )}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="amount">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
            </div>
            
            <div className="features">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8BC34A" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 6h-16v-2h16v2z" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
            
            <button 
              className="select-plan-btn"
              style={{ 
                backgroundColor: plan.color, 
                borderColor: plan.color 
              }}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h3>Start using myBillBook today</h3>
          <div className="input-group">
            <input type="text" placeholder="+91 - Enter mobile number" />
            <button className="start-free-trial">Start Free Trial →</button>
          </div>
          
          <div className="download-section">
            <p>Download app on</p>
            <div className="app-stores">
              <a href="#" className="store-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/256px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" />
              </a>
              <a href="#" className="store-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/256px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="app-screenshots">
          <img src="https://via.placeholder.com/300x600?text=App+Screenshot+1" alt="App Screenshot 1" />
          <img src="https://via.placeholder.com/300x600?text=App+Screenshot+2" alt="App Screenshot 2" />
          <img src="https://via.placeholder.com/300x600?text=App+Screenshot+3" alt="App Screenshot 3" />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to all the questions you may have</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-card ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className={`icon ${activeIndex === index ? 'open' : ''}`}>
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              <div className={`faq-answer ${activeIndex === index ? 'expanded' : ''}`}>
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingAndFAQ;