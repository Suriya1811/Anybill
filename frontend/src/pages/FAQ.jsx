import React from "react";
import "../styles/faq.css";

export default function FAQ() {
  return (
    <section className="page-faq container">
      <h1 className="h1">Frequently asked questions</h1>
      <div className="faq-list">
        <details className="card"><summary>Is there a free plan?</summary><p>Yes — the free plan lets you create invoices and manage basic inventory. Upgrade anytime for advanced features.</p></details>
        <details className="card"><summary>Can I generate GST invoices?</summary><p>Yes — create GST-compliant invoices with HSN/SAC, tax breakup, and round-off options. Multiple templates are available.</p></details>
        <details className="card"><summary>Do you support e-Invoicing and e-Way Bills?</summary><p>Yes — e-Invoicing and e-Way Bill workflows are supported. Configuration and API credentials may be required.</p></details>
        <details className="card"><summary>Can I import my existing data?</summary><p>Yes — import customers, products, and invoices via CSV/Excel. Exports are also available for accounting and audits.</p></details>
        <details className="card"><summary>How does recurring billing work?</summary><p>Set frequency and interval, and we’ll generate invoices automatically with optional payment reminders.</p></details>
        <details className="card"><summary>Is my data secure?</summary><p>Your data is encrypted in transit. Role-based access and activity controls help protect sensitive information.</p></details>
        <details className="card"><summary>Can my team use this?</summary><p>Yes — invite staff and assign roles (owner, admin, manager, staff) with fine-grained permissions.</p></details>
        <details className="card"><summary>Do you support mobile devices?</summary><p>Yes — the app is responsive and optimized for mobile, tablet, and desktop.</p></details>
        <details className="card"><summary>How do I get support?</summary><p>Use the contact page for email support. Priority support is available on paid plans.</p></details>
      </div>
    </section>
  );
}
