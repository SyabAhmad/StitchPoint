import React from "react";
import { Link } from "react-router-dom";
import { FaCut, FaHeart, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaExternalLinkAlt, FaUniversity } from "react-icons/fa";
import heroImage from "../assets/hero.jpg";
import fabric from "../assets/embroidery.jpg";
import saraAvatar from "../assets/sara-avatar.svg";
import mahrooshAvatar from "../assets/mahroosh-avatar.svg";

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[calc(100vh-3.5rem)] min-h-[400px] flex items-center overflow-hidden">
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
            A Final Year Project at the University of Swat — bringing premium
            Pakistani fashion to the digital world.
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
                  Naqsh Studio is a full-stack e-commerce platform developed as
                  the Final Year Project (FYP) at the University of Swat. The idea
                  was born from a desire to preserve Pakistan's rich textile and
                  tailoring heritage while giving it a modern, world-class digital
                  storefront.
                </p>
                <p>
                  What began as a concept on paper evolved into a complete online
                  fashion house — with a curated storefront, bespoke tailoring
                  services, seamless order management, and dedicated dashboards
                  for customers, staff, and administrators.
                </p>
                <p>
                  Every feature — from the elegant interface to the secure backend —
                  was designed and built with care. Every stitch of code reflects
                  the same commitment to quality and detail that defines the craft
                  of couture itself.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-cover bg-center rounded-xl overflow-hidden" style={{ backgroundImage: `url(${fabric})` }} />
            </div>
          </div>
        </div>
      </section>

      {/* FYP */}
      <section className="py-14 md:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
            <FaUniversity className="text-gold-500 text-lg" />
          </div>
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">Final Year Project</span>
          <h2 className="text-2xl md:text-3xl font-serif text-white mt-2 mb-5">
            University of Swat
          </h2>
          <p className="text-white/45 text-sm max-w-xl mx-auto leading-relaxed mb-8">
            Naqsh Studio was developed as the Final Year Project for the
            Department of Computer Science, University of Swat — a complete,
            production-ready e-commerce platform combining thoughtful design,
            robust engineering, and real-world business logic.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-5 py-3 rounded-xl border border-white/10 bg-white/5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Supervisor</p>
              <p className="text-white text-sm font-semibold">Dr. Muzzammil Khan</p>
            </div>
            <div className="px-5 py-3 rounded-xl border border-white/10 bg-white/5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Program</p>
              <p className="text-white text-sm font-semibold">BS Computer Science</p>
            </div>
            <div className="px-5 py-3 rounded-xl border border-white/10 bg-white/5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Deliverable</p>
              <p className="text-white text-sm font-semibold">Naqsh Studio Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">Our Expertise</span>
            <h2 className="text-2xl md:text-3xl font-serif text-black mt-2">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FaCut, title: "Bespoke Tailoring", desc: "Custom-fitted garments crafted with precision, from personal consultations to final fitting." },
              { icon: FaHeart, title: "Hand Embroidery", desc: "Intricate threadwork and embellishments — Aari work, mirror work, and custom patterns." },
              { icon: FaStar, title: "Bridal Collections", desc: "Complete bridal ensembles for your special day, designed to perfection." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-6 rounded-xl border border-black/5 hover:border-gold-500/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4">
                    <Icon className="text-gold-500 text-sm" />
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1.5">{s.title}</h3>
                  <p className="text-black/45 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 md:py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">The Team</span>
            <h2 className="text-2xl md:text-3xl font-serif text-white mt-2">Meet the Minds Behind Naqsh Studio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-7 rounded-2xl border border-white/10 hover:border-gold-500/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img src={saraAvatar} alt="Sara Ali" className="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-gold-500/40" />
                <div>
                  <h3 className="font-semibold text-white text-sm">Sara Ali</h3>
                  <p className="text-gold-500 text-xs mt-0.5">UI/UX Designer &amp; Frontend Developer</p>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">
                Sara is the creative soul of the project. She designed every screen —
                from the elegant storefront to the admin dashboards — with a rare
                eye for color, typography, and detail. Her interfaces don't just
                look beautiful; they feel effortless to use. She also engineered
                the frontend experience, ensuring the platform is responsive,
                accessible, and pixel-perfect on every device.
              </p>
              <a
                href="https://saraali.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-gold-500 hover:text-gold-400 text-xs font-semibold transition-colors duration-200"
              >
                View Portfolio <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>
            <div className="p-7 rounded-2xl border border-white/10 hover:border-gold-500/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img src={mahrooshAvatar} alt="Mahroosh" className="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-gold-500/40" />
                <div>
                  <h3 className="font-semibold text-white text-sm">Mahroosh</h3>
                  <p className="text-gold-500 text-xs mt-0.5">Fullstack Developer</p>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">
                Mahroosh is the engineering backbone of Naqsh Studio. She
                designed and built the entire backend — secure authentication,
                product and inventory management, order workflows, and the REST
                APIs that power the platform. Her rigorous testing and sharp
                problem-solving keep the system fast, reliable, and secure. From
                database schema to deployment, her code is clean, scalable, and
                production-ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">Our Values</span>
            <h2 className="text-2xl md:text-3xl font-serif text-black mt-2">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Artisanal Excellence", desc: "Every piece is handcrafted with meticulous attention to detail." },
              { title: "Personalized Service", desc: "Your unique vision guides our creative process." },
              { title: "Sustainable Fashion", desc: "We prioritize ethical materials and timeless designs." },
              { title: "Passion for Perfection", desc: "Our love for fashion drives us to create pieces that inspire." },
            ].map((v, i) => (
              <div key={i} className="p-5 rounded-xl border border-black/5 hover:border-gold-500/30 transition-all duration-300">
                <h3 className="font-semibold text-black text-sm mb-1.5">{v.title}</h3>
                <p className="text-black/45 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-3">
            Ready to Create Something Extraordinary?
          </h2>
          <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Let's discuss your vision and bring it to life with our expert craftsmanship.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-white/50">
              <FaMapMarkerAlt className="text-gold-500" />
              Swat, Pakistan
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <FaPhone className="text-gold-500" />
              +92 300 1234567
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <FaEnvelope className="text-gold-500" />
              info@naqshstudio.com
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
