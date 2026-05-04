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
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 flex items-center w-full h-full">
        <div
          ref={heroRef}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium tracking-wider">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Crafting Excellence Since 2008
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
              Where Tradition
              <br />
              <span className="text-white">Meets Innovation</span>
            </h1>

            <p className="text-sm md:text-base mb-6 leading-relaxed max-w-lg text-gray-300">
              Experience bespoke fashion crafted with precision, passion, and the
              finest materials.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Explore Collection
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/10">
              {[
                { number: "15+", label: "Years" },
                { number: "5000+", label: "Clients" },
                { number: "100%", label: "Handcrafted" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs mt-0.5 text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/40 rounded-full mt-1.5 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}