import React, { useState } from "react";
import "../styles/faq.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is there a free plan available?",
      answer: "Yes! Our Basic plan is completely free forever for up to 50 invoices per month. It includes essential features like GST invoicing, customer management, and email support. You can upgrade anytime as your business grows."
    },
    {
      question: "How secure is my business data?",
      answer: "Your data security is our top priority. We use bank-level 256-bit SSL encryption for all data transfers. All information is stored on secure cloud servers with daily automatic backups. We comply with industry-standard security protocols and never share your data with third parties."
    },
    {
      question: "Can I create GST-compliant invoices?",
      answer: "Absolutely! MyBillPro is fully GST-compliant. You can create invoices with proper GST calculations, HSN/SAC codes, tax breakdowns, and all mandatory fields. We also support GSTR-1 and GSTR-3B reports for easy tax filing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit cards (Visa, Mastercard, American Express), debit cards, UPI, net banking, and popular digital wallets. All transactions are processed through secure payment gateways."
    },
    {
      question: "Can I share invoices via WhatsApp?",
      answer: "Yes! With Premium and Enterprise plans, you can share invoices directly via WhatsApp with one click. This feature makes it super convenient to send invoices to your customers instantly without needing email or printing."
    },
    {
      question: "Do you offer inventory management?",
      answer: "Yes! Our Premium and Enterprise plans include complete inventory management features. Track stock levels in real-time, get low-stock alerts, manage product variants, handle multiple warehouses, and generate inventory reports."
    },
    {
      question: "Can multiple users access the same account?",
      answer: "Yes! You can add multiple team members depending on your plan. Basic plan includes 2 users, Premium includes 5 users, and Enterprise offers unlimited users. You can also set different permission levels for each user."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! MyBillPro is fully responsive and works perfectly on mobile browsers. You can access all features from your smartphone or tablet. We're also working on dedicated iOS and Android apps which will be launched soon."
    },
    {
      question: "Can I import my existing data?",
      answer: "Yes! You can easily import your existing customers, products, and invoices using CSV or Excel files. We provide import templates and our support team can help you with the migration process if needed."
    },
    {
      question: "What kind of customer support do you provide?",
      answer: "We offer email and chat support for all plans. Premium and Enterprise customers get priority 24/7 support with faster response times. Enterprise customers also get a dedicated account manager. Our average response time is under 2 hours during business hours."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time without any penalty or cancellation fees. Your account will remain active until the end of your current billing period. You can also export all your data before canceling."
    },
    {
      question: "Do you offer discounts for annual subscriptions?",
      answer: "Yes! We offer a 20% discount when you choose annual billing instead of monthly. For example, Premium plan costs ₹499/month or ₹4,790/year (saving ₹1,198). Contact our sales team for custom enterprise pricing."
    }
  ];

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">
            Find answers to common questions about MyBillPro. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-content">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">{openIndex === index ? '−' : '+'}</span>
                </div>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="faq-categories">
        <div className="container">
          <h2 className="section-title">Need More Help?</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">📚</div>
              <h4>Knowledge Base</h4>
              <p>Browse detailed guides and tutorials</p>
              <a href="#" className="category-link">Visit Knowledge Base →</a>
            </div>
            <div className="category-card">
              <div className="category-icon">🎥</div>
              <h4>Video Tutorials</h4>
              <p>Watch step-by-step video guides</p>
              <a href="#" className="category-link">Watch Videos →</a>
            </div>
            <div className="category-card">
              <div className="category-icon">💬</div>
              <h4>Live Chat</h4>
              <p>Chat with our support team</p>
              <a href="/contact" className="category-link">Start Chat →</a>
            </div>
            <div className="category-card">
              <div className="category-icon">👥</div>
              <h4>Community Forum</h4>
              <p>Connect with other users</p>
              <a href="#" className="category-link">Join Community →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="faq-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Still Have Questions?</h2>
            <p>Our friendly support team is here to help you anytime.</p>
            <a href="/contact" className="btn btn-primary btn-large">Contact Support</a>
          </div>
        </div>
      </section>
    </div>
  );
}
