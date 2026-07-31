import React from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Aisha Khan",
    role: "Bride",
    quote: "The wedding dress was beyond my expectations. Every stitch was perfect, and the fitting was impeccable.",
    rating: 5,
    initials: "AK",
  },
  {
    id: 2,
    name: "Omar Farooq",
    role: "Entrepreneur",
    quote: "Exceptional craftsmanship and attention to detail. My bespoke suit received countless compliments.",
    rating: 5,
    initials: "OF",
  },
  {
    id: 3,
    name: "Mariyam Hassan",
    role: "Fashion Enthusiast",
    quote: "Fast turnaround, exquisite finishing, and a team that truly understands fabric and design.",
    rating: 5,
    initials: "MH",
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 md:py-20 bg-black/[0.02]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-black mt-2 mb-3">
            What Our Clients Say
          </h2>
          <p className="text-black/45 max-w-lg mx-auto text-sm leading-relaxed">
            Trusted by clients who value quality craftsmanship and timeless design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-xl border border-black/5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < t.rating ? "text-gold-500 text-xs" : "text-black/10 text-xs"} />
                ))}
              </div>
              <p className="text-black/55 text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 font-semibold text-xs">
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-black">{t.name}</p>
                  <p className="text-[11px] text-black/30">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
