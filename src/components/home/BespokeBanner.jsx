import React from "react";
import { Link } from "react-router-dom";
import { FaRegCalendarAlt, FaGift } from "react-icons/fa";
import dreamImage from "../../assets/dream.jpg";

const BespokeBanner = () => {
  return (
    <section className="relative bg-[#141414] border-y border-gold-500/15 py-16 md:py-20 overflow-hidden">
      {/* background image with heavy dark overlay */}
      <img
        src={dreamImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.14] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-transparent to-[#141414] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <span className="inline-flex items-center gap-2 text-gold-500 text-xs font-semibold tracking-[0.25em] uppercase mb-5">
          <span className="h-px w-8 bg-gold-500/60" />
          By Appointment Only
          <span className="h-px w-8 bg-gold-500/60" />
        </span>

        <h2 className="text-3xl md:text-4xl font-serif text-white leading-snug">
          A Bespoke Piece,
          <span className="text-gold-500 italic"> Made for You Alone</span>
        </h2>

        <p className="text-white/45 text-sm md:text-[15px] leading-relaxed mt-5 max-w-xl mx-auto">
          Private consultations with our master designers. Choose your fabric, your silhouette,
          your embroidery — and receive a garment tailored to you, signed and sealed by the
          atelier.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-7 py-3 bg-gold-500 text-black text-xs font-semibold uppercase tracking-[0.15em] rounded hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/20"
          >
            <FaRegCalendarAlt className="group-hover:scale-110 transition-transform" />
            Book a Private Consultation
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-[0.15em] rounded hover:border-gold-500 hover:text-gold-500 transition-colors"
          >
            <FaGift />
            Gift a Couture Piece
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BespokeBanner;
