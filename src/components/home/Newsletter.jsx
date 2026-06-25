import React from "react";

export default function Newsletter() {
  return (
    <section className="py-16 px-4 bg-white border-t border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 max-w-6xl mx-auto">
        <div className="flex-1 max-w-lg">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
            STAY IN THE LOOP
          </h3>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Sign up for exclusive releases and behind-the-scenes.
          </p>
        </div>
        <form
          className="flex gap-4 flex-1 max-w-md"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="flex-1 px-4 py-3 border-2 border-black/20 focus:border-black focus:outline-none transition-colors duration-300 text-base bg-transparent"
            placeholder="Your email"
            aria-label="Email"
          />
          <button
            className="bg-black text-white px-6 py-3 font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
