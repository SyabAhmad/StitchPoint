import React from "react";

const classes = ["Wedding", "Casual", "Formals", "Bridal", "Accessories"];

export default function ClassesSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gold-500/2 to-white/98 flex items-center justify-center flex-col">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-gold-500 mb-2">
          Explore Our Collections
        </h2>
        <p className="text-base md:text-lg text-black/70 leading-relaxed">
          Handpicked styles for every occasion
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center align-items-center mt-4">
        {classes.map((c) => (
          <button
            key={c}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gold-600 border border-gold-500/20 font-semibold text-sm md:text-base shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}
