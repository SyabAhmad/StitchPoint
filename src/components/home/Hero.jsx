import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>

      <div className="absolute inset-0 bg-black/80"></div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

      <div className="relative z-10 flex items-center w-full h-full">
        <div
          ref={heroRef}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 mb-6 border border-white/30">
              <span className="w-2 h-2 bg-white"></span>
              <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">
                Est. 2008
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              WHERE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                TRADITION
              </span>
              <br />
              MEETS ART
            </h1>

            <p className="text-base md:text-lg mb-8 leading-relaxed max-w-lg text-gray-300" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Discover bespoke fashion crafted with precision, passion, and the finest
              materials. Your vision, our craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-all duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/50 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
              >
                Our Story
              </Link>
            </div>

            <div className="flex flex-wrap gap-10 mt-12 pt-10 border-t border-white/20">
              {[
                { number: "15+", label: "YEARS" },
                { number: "5000+", label: "CLIENTS" },
                { number: "100%", label: "HANDCRAFTED" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs tracking-widest text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/40 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}