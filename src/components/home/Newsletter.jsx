import React from "react";

export default function Newsletter() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gold-500/2 to-white/98">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 max-w-6xl mx-auto">
        <div className="flex-1 max-w-lg">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-gold-500 mb-2">
            Stay in the loop
          </h3>
          <p className="text-base md:text-lg text-black/70 leading-relaxed">
            Sign up for exclusive releases and behind-the-scenes.
          </p>
        </div>
        <form
          className="flex gap-4 flex-1 max-w-md"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="flex-1 px-4 py-3 rounded-lg border-2 border-black/10 focus:outline-none focus:border-gold-500 transition-colors duration-300 text-base"
            placeholder="Your email"
            aria-label="Email"
          />
          <button
            className="bg-gold-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
