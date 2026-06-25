import React from "react";

const classes = ["Wedding", "Casual", "Formals", "Bridal", "Accessories"];

export default function ClassesSection() {
  return (
    <section className="py-16 px-4 bg-white flex items-center justify-center flex-col">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
          EXPLORE OUR COLLECTIONS
        </h2>
        <p className="text-base md:text-lg text-gray-500 leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Handpicked styles for every occasion
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center align-items-center mt-4">
        {classes.map((c) => (
          <button
            key={c}
            className="px-6 py-3 bg-black/5 border border-black/20 text-black font-bold text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}