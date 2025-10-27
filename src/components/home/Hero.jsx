import React from "react";
import heroImage from "../../assets/hero.jpg";

export default function Hero() {
  return (
    <section className="w-full">
      <div
        className="w-full min-h-[500px] md:h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60"></div>
        <div className="relative z-10 text-white text-center px-8 py-12 max-w-4xl mx-auto rounded-2xl shadow-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-gold-500 mb-4 drop-shadow-lg">
            Crafting Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl opacity-95 leading-relaxed">
            Where tradition meets innovation in the art of bespoke fashion
          </p>
        </div> */}
      </div>
    </section>
  );
}
