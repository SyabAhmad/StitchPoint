import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import { FaChevronDown } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Background Image — full screen, no heavy overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Minimal gradient at bottom for CTA area */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* CTA at bottom */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-10">
        <Link
          to="/shop"
          className="bg-gold-500 text-white px-8 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-gold-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Explore Collection
        </Link>
        <a
          href="#services"
          className="text-white/50 hover:text-white/80 transition-colors"
        >
          <FaChevronDown className="text-lg animate-bounce" />
        </a>
      </div>
    </section>
  );
}
