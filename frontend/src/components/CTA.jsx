import React from "react";
import { Link } from "react-router-dom";
import "../styles/cta.css";

export default function CTA() {
  return (
    <section className="cta container">
      <div className="cta-inner card">
        <div>
          <h2 className="h2">Ready to simplify your billing?</h2>
          <p className="lead">Start a free trial today — no credit card required.</p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-primary" to="/signup">Start Free</Link>
          <Link className="btn btn-outline" to="/pricing">View Plans</Link>
        </div>
      </div>
    </section>
  );
}
