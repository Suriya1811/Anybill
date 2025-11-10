import React from "react";
import { Link } from "react-router-dom";
import "../styles/pricing.css";

export default function Pricing() {
  return (
    <section className="page-pricing container">
      <h1 className="h1">Pricing</h1>
      <p className="lead">Simple pricing. Start free and upgrade later.</p>

      <div className="pricing-grid">
        <div className="plan card">
          <h3>Free</h3>
          <div className="price">₹0</div>
          <ul>
            <li>Unlimited invoices</li>
            <li>Basic reports</li>
            <li>Email support</li>
          </ul>
          <Link className="btn btn-primary" to="/signup">Get started</Link>
        </div>

        <div className="plan card">
          <h3>Pro</h3>
          <div className="price">₹299 / mo</div>
          <ul>
            <li>Inventory & reports</li>
            <li>Multiple users</li>
            <li>Priority support</li>
          </ul>
          <Link className="btn btn-primary" to="/signup">Start free trial</Link>
        </div>
      </div>
    </section>
  );
}
