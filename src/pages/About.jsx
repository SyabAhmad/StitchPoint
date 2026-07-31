import React from "react";
import { Link } from "react-router-dom";
import { FaCut, FaHeart, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import heroImage from "../assets/hero.jpg";
import fabric from "../assets/embroidery.jpg";

export default function About() {
  return (
    <div className="bg-white min-h-screen pt-14">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.25em] uppercase mb-3 block">
            About Us
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-3">
            Our Story
          </h1>
          <p className="text-white/70 text-sm max-w-md leading-relaxed">
            A tale of passion, craftsmanship, and the pursuit of fashion excellence.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">The Journey</span>
              <h2 className="text-2xl md:text-3xl font-serif text-black mt-2 mb-5">From Vision to Reality</h2>
              <div className="space-y-4 text-black/55 text-sm leading-relaxed">
                <p>
                  Founded in 2008, Naqsh Couture emerged from a passion for preserving
                  Pakistan's rich textile heritage while embracing contemporary design aesthetics.
                </p>
                <p>
                  What began as a small workshop evolved into a premier destination for bespoke
                  fashion that tells unique stories through every thread and pattern.
                </p>
                <p>
                  Our commitment to excellence is unwavering. Every stitch, every pattern, every
                  fabric choice reflects our dedication to creating timeless pieces that stand
                  the test of time.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-cover bg-center rounded-xl overflow-hidden" style={{ backgroundImage: `url(${fabric})` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 md:py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">Our Expertise</span>
            <h2 className="text-2xl md:text-3xl font-serif text-white mt-2">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FaCut, title: "Bespoke Tailoring", desc: "Custom-fitted garments crafted with precision, from personal consultations to final fitting." },
              { icon: FaHeart, title: "Hand Embroidery", desc: "Intricate threadwork and embellishments — Aari work, mirror work, and custom patterns." },
              { icon: FaStar, title: "Bridal Collections", desc: "Complete bridal ensembles for your special day, designed to perfection." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-6 rounded-xl border border-white/10 hover:border-gold-500/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4">
                    <Icon className="text-gold-500 text-sm" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">The Team</span>
            <h2 className="text-2xl md:text-3xl font-serif text-black mt-2">Meet the People Behind the Craft</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Sara Ali", role: "UI/UX Designer & Developer", desc: "Crafting beautiful digital experiences that blend aesthetics with functionality.", initials: "SA" },
              { name: "Mahroosh", role: "Fullstack Developer", desc: "Building robust backend systems and seamless frontend experiences.", initials: "MH" },
            ].map((m, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-black/5 hover:border-gold-500/30 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 font-semibold text-sm flex-shrink-0">
                  {m.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-black text-sm">{m.name}</h3>
                  <p className="text-gold-500 text-xs mb-1.5">{m.role}</p>
                  <p className="text-black/45 text-xs leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">Our Values</span>
            <h2 className="text-2xl md:text-3xl font-serif text-white mt-2">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Artisanal Excellence", desc: "Every piece is handcrafted with meticulous attention to detail." },
              { title: "Personalized Service", desc: "Your unique vision guides our creative process." },
              { title: "Sustainable Fashion", desc: "We prioritize ethical materials and timeless designs." },
              { title: "Passion for Perfection", desc: "Our love for fashion drives us to create pieces that inspire." },
            ].map((v, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 hover:border-gold-500/30 transition-all duration-300">
                <h3 className="font-semibold text-white text-sm mb-1.5">{v.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-black mb-3">
            Ready to Create Something Extraordinary?
          </h2>
          <p className="text-black/45 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Let's discuss your vision and bring it to life with our expert craftsmanship.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-black/50">
              <FaMapMarkerAlt className="text-gold-500" />
              Lahore, Pakistan
            </div>
            <div className="flex items-center gap-2 text-black/50">
              <FaPhone className="text-gold-500" />
              +92 300 1234567
            </div>
            <div className="flex items-center gap-2 text-black/50">
              <FaEnvelope className="text-gold-500" />
              info@naqshcouture.com
            </div>
          </div>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-block bg-gold-500 text-black px-6 py-2.5 rounded-md font-semibold text-xs hover:bg-gold-600 transition-all duration-200"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
