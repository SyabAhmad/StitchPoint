import React from "react";

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="container-inline newsletter-inner">
        <div>
          <h3 className="section-heading">Stay in the loop</h3>
          <p>Sign up for exclusive releases and behind-the-scenes.</p>
        </div>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            className="newsletter-input"
            placeholder="Your email"
            aria-label="Email"
          />
          <button className="btn-gold" type="submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
