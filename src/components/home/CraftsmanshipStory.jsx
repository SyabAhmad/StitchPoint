import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import embroideryImage from "../../assets/embroidery.jpg";
import modelImage from "../../assets/model.jpg";

const STATS = [
  { value: 150, suffix: "+", label: "Artisan Partners" },
  { value: 1200, suffix: "+", label: "Unique Designs" },
  { value: 30, suffix: "+", label: "Cities Served" },
  { value: 10, suffix: "k+", label: "Happy Clients" },
];

const useCountUp = (target, start) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const duration = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);
  return value;
};

const Stat = ({ value, suffix, label, start }) => {
  const count = useCountUp(value, start);
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-serif text-gold-500 font-semibold">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1.5">{label}</p>
    </div>
  );
};

const Ornament = () => (
  <div className="flex items-center gap-2">
    <span className="h-px w-8 bg-gold-500/60" />
    <span className="text-gold-500 text-[10px]">✦</span>
    <span className="h-px w-8 bg-gold-500/60" />
  </div>
);

export default function CraftsmanshipStory() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-black py-16 md:py-24 overflow-hidden relative">
      {/* subtle gold glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold-500/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold-500/[0.04] blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative max-w-md mx-auto w-full" ref={ref}>
            <div className="absolute -inset-3 border border-gold-500/25 rounded-xl translate-x-4 translate-y-4 pointer-events-none" />
            <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
              <img
                src={embroideryImage}
                alt="Hand embroidery craftsmanship"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = modelImage; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* rotating seal */}
            <div className="absolute -bottom-7 -right-7 w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-black border border-gold-500/40 shadow-xl shadow-gold-500/10" />
              <svg viewBox="0 0 100 100" className="w-full h-full nc-seal">
                <defs>
                  <path
                    id="nc-circle"
                    d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  />
                </defs>
                <text fill="#D4AF37" fontSize="10" letterSpacing="2.5" className="select-none">
                  <textPath href="#nc-circle">HANDCRAFTED ✦ SINCE ✦ 2024 ✦</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-gold-500 text-lg">
                ✦
              </span>
            </div>
          </div>

          {/* Text side */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center gap-3 mb-4">
              <Ornament />
              <span className="text-gold-500 text-xs font-semibold tracking-[0.25em] uppercase">
                The Atelier
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-white leading-snug">
              Crafted by Hand,
              <br />
              <span className="text-gold-500 italic">Worn with Pride</span>
            </h2>

            <p className="text-white/45 text-sm md:text-[15px] leading-relaxed mt-5 max-w-lg mx-auto lg:mx-0">
              Every Naqsh Studio piece begins as a single thread in the hands of our master
              artisans. From intricate zardozi to delicate resham, each garment is a quiet
              collaboration between heritage technique and modern design — finished, inspected,
              and perfected by hand.
            </p>

            <p className="text-white/35 text-sm leading-relaxed mt-4 max-w-lg mx-auto lg:mx-0">
              We work directly with artisan communities across the country, ensuring fair
              craft, premium fabrics, and a level of finish that machine production simply
              cannot touch.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 border-t border-white/10 pt-8">
              {STATS.map((stat) => (
                <Stat key={stat.label} {...stat} start={inView} />
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-10">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-black text-xs font-semibold uppercase tracking-[0.15em] rounded hover:bg-gold-600 transition-colors"
              >
                Our Story
                <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-[0.15em] rounded hover:border-gold-500 hover:text-gold-500 transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
