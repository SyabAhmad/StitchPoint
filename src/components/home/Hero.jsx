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
    <section className="relative w-full h-screen min-h-[700px] max-h-[900px] overflow-hidden flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${heroImage})`,
        }}
      ></div>

      {/* Strong Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/85"></div>

      {/* Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center w-full h-full">
        <div
          ref={heroRef}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in"
        >
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 mb-6 border border-white/30">
              <span className="w-2 h-2 bg-white"></span>
              <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">
                Est. 2008
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white tracking-wider uppercase"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Where{" "}
              <span className="italic font-normal">
                Tradition
              </span>
              <br />
              Meets{" "}
              <span className="italic font-normal">
                Art
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg mb-6 leading-relaxed max-w-xl text-gray-200" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Discover bespoke fashion crafted with precision, passion, and the finest materials. Your vision, our craftsmanship.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-all duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                View Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-white/20">
              {[
                { number: "15+", label: "YEARS" },
                { number: "5000+", label: "CLIENTS" },
                { number: "100%", label: "HANDCRAFTED" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs tracking-widest text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}