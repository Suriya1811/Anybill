import React from "react";
import "../styles/contactform.css";

export default function ContactForm() {
  return (
    <form className="contact-form card" onSubmit={(e)=>e.preventDefault()}>
      <div className="row">
        <input required placeholder="Your name" className="input" />
        <input required placeholder="Email or phone" className="input" />
      </div>
      <input required placeholder="Subject" className="input" />
      <textarea required placeholder="Tell us how we can help" className="textarea" rows="5" />
      <div style={{display:"flex", justifyContent:"flex-end"}}>
        <button className="btn btn-primary" type="submit">Send message</button>
      </div>
    </form>
  );
}
