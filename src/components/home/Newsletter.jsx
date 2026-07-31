import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-14 md:py-20 bg-black">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
          Stay Connected
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-white mt-2 mb-3">
          Join Our Newsletter
        </h2>
        <p className="text-white/35 max-w-sm mx-auto text-sm leading-relaxed mb-8">
          Get early access to new collections, exclusive offers, and insider updates delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold-500/40 transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:bg-gold-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <FaPaperPlane className="text-[10px]" />
            {submitted ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        <p className="text-white/20 text-[11px] mt-3">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
