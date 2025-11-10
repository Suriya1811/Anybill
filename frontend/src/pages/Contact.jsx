import React from "react";
import ContactForm from "../components/ContactForm";
import "../styles/contact.css";

export default function Contact() {
  return (
    <section className="page-contact container">
      <h1 className="h1">Contact</h1>
      <p className="lead">Need help? Send a message and we'll reply within 24 hours.</p>

      <div className="contact-grid">
        <ContactForm />
        <div className="contact-info card">
          <h3>Office</h3>
          <p>support@mybillpro.example</p>
          <p>+91 99999 99999</p>
        </div>
      </div>
    </section>
  );
}
