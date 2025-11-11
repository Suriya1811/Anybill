import React from "react";
import "../styles/about.css";

export default function About() {
  return (
    <section className="page-about container">
      <h1 className="h1">About MyBillPro</h1>
      <p className="lead">We build simple & reliable billing software to help small businesses grow.</p>

      <div className="about-grid">
        <div className="card">
          <h3>Our mission</h3>
          <p>To make billing painless and fast for every small business.</p>
        </div>
        <div className="card">
          <h3>Our values</h3>
          <p>Trust, speed, simplicity and great UX.</p>
        </div>
      </div>
    </section>
  );
}
