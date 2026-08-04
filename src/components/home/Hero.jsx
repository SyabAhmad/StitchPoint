import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import bohoGardenGroup from "../../assets/boho_garden_group.webp";
import bohoFashionEditorial from "../../assets/boho_fashion_editorial.webp";
import bohoMeadowWalk from "../../assets/boho_meadow_walk.webp";
import bohoMeadowGoldenHour from "../../assets/boho_meadow_golden_hour.webp";
import sunlitParkEditorial from "../../assets/sunlit_park_fashion_editorial.webp";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SLIDES = [
  { image: heroImage, title: "Naqsh Couture", subtitle: "Premium Pakistani Fashion" },
  { image: bohoGardenGroup, title: "The Boho Garden", subtitle: "Free-spirited silhouettes" },
  { image: bohoFashionEditorial, title: "Editorial Boho", subtitle: "Fashion that wanders" },
  { image: bohoMeadowWalk, title: "Meadow Walk", subtitle: "Soft fabrics, open skies" },
  { image: bohoMeadowGoldenHour, title: "Golden Hour", subtitle: "Warm tones, warmer days" },
  { image: sunlitParkEditorial, title: "Sunlit Park", subtitle: "Chasing the light" },
];

const AUTOPLAY_MS = 5500;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Slides (crossfade) */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Minimal gradient at bottom for CTA area */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Slide caption (skipped on slide 1 — hero image already has the branding) */}
      {current !== 0 && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-6 text-center pointer-events-none">
          <div
            key={current}
            className="nc-hero-caption flex flex-col items-center"
          >
            <span className="text-gold-500 text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">
              {SLIDES[current].subtitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white drop-shadow-lg">
              {SLIDES[current].title}
            </h1>
          </div>
        </div>
      )}

      {/* Arrows */}
      <button
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/30 hover:bg-gold-500/90 hover:text-black text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
      >
        <FaChevronLeft className="text-sm" />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/30 hover:bg-gold-500/90 hover:text-black text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
      >
        <FaChevronRight className="text-sm" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-gold-500"
                : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

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
