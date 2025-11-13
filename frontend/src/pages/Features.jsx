import React from "react";
import "../styles/features.css";

export default function Features() {
  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <h1 className="page-title">Everything You Need to Run Your Business</h1>
          <p className="page-subtitle">
            Powerful features designed to save time, reduce errors, and boost profits. 
            All the tools you need, beautifully organized in one platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-main">
        <div className="container">
          
          {/* Feature 1: Invoicing */}
          <div className="feature-block">
            <div className="feature-content">
              <div className="feature-badge">📄 Invoicing</div>
              <h2>Professional GST & Non-GST Invoicing</h2>
              <p>
                Create beautiful, compliant invoices in seconds. Choose from multiple templates including A4, A5, thermal (58mm/80mm), and custom formats. Automatic tax calculations, HSN/SAC codes, and professional branding options included.
              </p>
              <ul className="feature-list">
                <li>✓ GST-compliant invoices with tax breakdowns</li>
                <li>✓ Multiple templates (Classic, Modern, Retail, Thermal)</li>
                <li>✓ Custom branding with logo and colors</li>
                <li>✓ Automatic tax calculations and rounding</li>
                <li>✓ Print, download PDF, or share via WhatsApp</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-placeholder">
                <span className="placeholder-icon">📑</span>
                <p>Invoice Template Preview</p>
              </div>
            </div>
          </div>

          {/* Feature 2: Inventory */}
          <div className="feature-block reverse">
            <div className="feature-content">
              <div className="feature-badge">📦 Inventory</div>
              <h2>Smart Inventory & Stock Management</h2>
              <p>
                Never run out of stock again. Track products, variants, batches, and quantities in real-time. Get low-stock alerts and manage your inventory across multiple warehouses.
              </p>
              <ul className="feature-list">
                <li>✓ Real-time stock level tracking</li>
                <li>✓ Low-stock alerts and notifications</li>
                <li>✓ Product variants and batch management</li>
                <li>✓ Multi-warehouse inventory control</li>
                <li>✓ Barcode scanning and SKU management</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-placeholder">
                <span className="placeholder-icon">📊</span>
                <p>Inventory Dashboard</p>
              </div>
            </div>
          </div>

          {/* Feature 3: Expense Tracking */}
          <div className="feature-block">
            <div className="feature-content">
              <div className="feature-badge">💰 Expenses</div>
              <h2>Expense Management & Tracking</h2>
              <p>
                Keep track of every rupee spent. Record purchases, bills, and expenses with categories. Upload receipts and maintain complete financial records for accurate reporting.
              </p>
              <ul className="feature-list">
                <li>✓ Record all business expenses</li>
                <li>✓ Categorize spending for better insights</li>
                <li>✓ Upload and attach receipt images</li>
                <li>✓ Track vendor payments and dues</li>
                <li>✓ Generate expense reports instantly</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-placeholder">
                <span className="placeholder-icon">💳</span>
                <p>Expense Tracker</p>
              </div>
            </div>
          </div>

          {/* Feature 4: Analytics */}
          <div className="feature-block reverse">
            <div className="feature-content">
              <div className="feature-badge">📈 Analytics</div>
              <h2>Real-Time Reports & Business Analytics</h2>
              <p>
                Make data-driven decisions with powerful analytics. Track sales, revenue, profit margins, and customer behavior. Export reports for accounting or share with stakeholders.
              </p>
              <ul className="feature-list">
                <li>✓ Sales and revenue dashboards</li>
                <li>✓ Profit & loss statements</li>
                <li>✓ Tax reports (GST, GSTR-1, GSTR-3B)</li>
                <li>✓ Customer and product performance</li>
                <li>✓ Export to Excel/PDF for accounting</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-placeholder">
                <span className="placeholder-icon">📉</span>
                <p>Analytics Dashboard</p>
              </div>
            </div>
          </div>

          {/* Feature 5: WhatsApp Sharing */}
          <div className="feature-block">
            <div className="feature-content">
              <div className="feature-badge">💬 Communication</div>
              <h2>WhatsApp Invoice Sharing</h2>
              <p>
                Send invoices directly to your customers via WhatsApp with one click. No need for email or printing. Fast, convenient, and preferred by most customers.
              </p>
              <ul className="feature-list">
                <li>✓ One-click WhatsApp sharing</li>
                <li>✓ Send invoices, quotes, and receipts</li>
                <li>✓ Automatic payment reminders</li>
                <li>✓ Customer communication history</li>
                <li>✓ Professional message templates</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-placeholder">
                <span className="placeholder-icon">📱</span>
                <p>WhatsApp Integration</p>
              </div>
            </div>
          </div>

          {/* Feature 6: Cloud Backup */}
          <div className="feature-block reverse">
            <div className="feature-content">
              <div className="feature-badge">☁️ Security</div>
              <h2>Secure Cloud Data Backup</h2>
              <p>
                Your business data is automatically backed up to secure cloud servers. Access your information anytime, anywhere, from any device. Never lose important data again.
              </p>
              <ul className="feature-list">
                <li>✓ Automatic cloud backups</li>
                <li>✓ Bank-level encryption</li>
                <li>✓ Access from any device</li>
                <li>✓ 99.9% uptime guarantee</li>
                <li>✓ Data recovery and restore options</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="visual-placeholder">
                <span className="placeholder-icon">🔒</span>
                <p>Cloud Security</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Additional Features */}
      <section className="additional-features">
        <div className="container">
          <h2 className="section-title">And Much More...</h2>
          <div className="mini-features-grid">
            <div className="mini-feature">
              <div className="mini-icon">🔄</div>
              <h4>Recurring Invoices</h4>
              <p>Automate repeat billing for subscriptions</p>
            </div>
            <div className="mini-feature">
              <div className="mini-icon">👥</div>
              <h4>Customer Management</h4>
              <p>Maintain complete customer database</p>
            </div>
            <div className="mini-feature">
              <div className="mini-icon">📧</div>
              <h4>Email Notifications</h4>
              <p>Automated payment reminders</p>
            </div>
            <div className="mini-feature">
              <div className="mini-icon">🎨</div>
              <h4>Custom Branding</h4>
              <p>Add your logo and brand colors</p>
            </div>
            <div className="mini-feature">
              <div className="mini-icon">📤</div>
              <h4>Import/Export Data</h4>
              <p>CSV and Excel compatibility</p>
            </div>
            <div className="mini-feature">
              <div className="mini-icon">🔐</div>
              <h4>User Roles & Permissions</h4>
              <p>Control access for team members</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="features-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Experience All Features Free for 30 Days</h2>
            <p>No credit card required. Start creating professional invoices today.</p>
            <a href="/signup" className="btn btn-primary btn-large">Start Free Trial</a>
          </div>
        </div>
      </section>
    </div>
  );
}
