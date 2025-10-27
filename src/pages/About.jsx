import React from "react";
import heroImage from "../assets/hero.jpg";
import team1 from "../assets/team1.jpg";
import workshop from "../assets/workshop.jpg";
import founder from "../assets/founder.jpg";

export default function About() {
  return (
    <div className="bg-gradient-to-br from-black-silk/2 to-white/98">
      {/* Hero Section */}
      <section className="relative flex items-center overflow-hidden min-h-[80vh]">
        <div className="flex-1 p-8 max-w-[600px] z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-gold-500 font-bold font-serif leading-tight mb-4">
            Crafting Timeless Elegance
          </h1>
          <p className="text-lg text-black/80 leading-relaxed mb-8">
            Where tradition meets innovation in the art of bespoke fashion
          </p>
          <div className="flex gap-8 mb-8">
            <div className="text-center">
              <span className="block text-4xl font-bold text-gold-500 mb-2">
                15+
              </span>
              <span className="text-sm text-black/70 font-medium">
                Years of Excellence
              </span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold text-gold-500 mb-2">
                500+
              </span>
              <span className="text-sm text-black/70 font-medium">
                Happy Clients
              </span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold text-gold-500 mb-2">
                100%
              </span>
              <span className="text-sm text-black/70 font-medium">
                Custom Made
              </span>
            </div>
          </div>
        </div>
        <div
          className="flex-1 min-h-[500px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30"></div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 text-center mb-12 font-bold font-serif">
            Our Journey
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-lg text-black/80 leading-relaxed">
                Founded by Sarah Khan, Naqsh Couture emerged from a passion for
                preserving Pakistan's rich textile heritage while embracing
                contemporary design sensibilities. What began as a small
                workshop has evolved into a premier destination for bespoke
                fashion that tells unique stories.
              </p>
              <p className="text-lg text-black/80 leading-relaxed">
                Our commitment to excellence is unwavering. Every stitch, every
                pattern, every fabric choice reflects our dedication to creating
                garments that are not just beautiful, but meaningful. We believe
                fashion should empower, celebrate, and endure.
              </p>
            </div>
            <div
              className="h-96 bg-cover bg-center rounded-2xl shadow-2xl border-4 border-gold-500/20"
              style={{ backgroundImage: `url(${founder})` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="py-24 bg-gradient-to-br from-gold-500/2 to-white/95">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4">
              Our Expertise
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              Comprehensive fashion services tailored to your vision
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="text-6xl mb-6 p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                👗
              </div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Bespoke Tailoring
              </h3>
              <p className="text-black/80 mb-6 leading-relaxed">
                Custom-fitted garments crafted with precision and care
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Personal
                  consultations
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Premium fabric
                  selection
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Multiple fittings
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="text-6xl mb-6 p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                🧵
              </div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Hand Embroidery
              </h3>
              <p className="text-black/80 mb-6 leading-relaxed">
                Intricate threadwork bringing traditional patterns to life
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Aari work
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Mirror work
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Custom designs
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="text-6xl mb-6 p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                🔄
              </div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Restyling & Alterations
              </h3>
              <p className="text-black/80 mb-6 leading-relaxed">
                Transform existing pieces into contemporary treasures
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Vintage
                  restoration
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Modern updates
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Sustainable
                  fashion
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="text-6xl mb-6 p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                👑
              </div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Bridal Collections
              </h3>
              <p className="text-black/80 mb-6 leading-relaxed">
                Complete bridal ensembles for your special day
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Wedding gowns
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Bridal
                  accessories
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Family
                  coordination
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="text-6xl mb-6 p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                🎭
              </div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Event Wear
              </h3>
              <p className="text-black/80 mb-6 leading-relaxed">
                Stunning outfits for every occasion
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Formal wear
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Cocktail dresses
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Cultural attire
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="text-6xl mb-6 p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                🛍️
              </div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Ready-to-Wear
              </h3>
              <p className="text-black/80 mb-6 leading-relaxed">
                Curated collection of contemporary designs
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Seasonal
                  collections
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Size inclusive
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>Quality assured
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Map */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4">
              Nationwide Delivery
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              Delivering craftsmanship across Pakistan
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg border-2 border-gold-500/20">
              <svg viewBox="0 0 400 500" className="w-full h-96 max-w-md">
                {/* Simplified Pakistan map outline */}
                <path
                  d="M50,100 L350,100 L350,400 L50,400 Z"
                  fill="#f8f9fa"
                  stroke="#d4af37"
                  strokeWidth="2"
                />
                {/* Punjab */}
                <circle
                  cx="150"
                  cy="150"
                  r="8"
                  fill="#d4af37"
                  className="cursor-pointer transition-all duration-300 hover:r-12 hover:fill-gold-600"
                >
                  <title>Punjab - Lahore, Faisalabad, Rawalpindi</title>
                </circle>
                <text
                  x="150"
                  y="175"
                  textAnchor="middle"
                  className="text-sm font-semibold text-gold-500"
                >
                  Punjab
                </text>
                {/* Sindh */}
                <circle
                  cx="120"
                  cy="350"
                  r="8"
                  fill="#d4af37"
                  className="cursor-pointer transition-all duration-300 hover:r-12 hover:fill-gold-600"
                >
                  <title>Sindh - Karachi, Hyderabad, Sukkur</title>
                </circle>
                <text
                  x="120"
                  y="375"
                  textAnchor="middle"
                  className="text-sm font-semibold text-gold-500"
                >
                  Sindh
                </text>
                {/* KPK */}
                <circle
                  cx="250"
                  cy="120"
                  r="8"
                  fill="#d4af37"
                  className="cursor-pointer transition-all duration-300 hover:r-12 hover:fill-gold-600"
                >
                  <title>Khyber Pakhtunkhwa - Peshawar, Abbottabad</title>
                </circle>
                <text
                  x="250"
                  y="145"
                  textAnchor="middle"
                  className="text-sm font-semibold text-gold-500"
                >
                  KPK
                </text>
                {/* Balochistan */}
                <circle
                  cx="80"
                  cy="200"
                  r="8"
                  fill="#d4af37"
                  className="cursor-pointer transition-all duration-300 hover:r-12 hover:fill-gold-600"
                >
                  <title>Balochistan - Quetta, Gwadar</title>
                </circle>
                <text x="80" y="225" textAnchor="middle" className="map-label">
                  Balochistan
                </text>
                {/* Islamabad */}
                <circle
                  cx="180"
                  cy="130"
                  r="6"
                  fill="#b8860b"
                  className="cursor-pointer transition-all duration-300 hover:r-10 hover:fill-gold-600"
                >
                  <title>Islamabad Capital Territory</title>
                </circle>
                <text
                  x="180"
                  y="155"
                  textAnchor="middle"
                  className="text-xs font-medium text-gold-600"
                >
                  Islamabad
                </text>
              </svg>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl text-gold-500 font-serif font-bold">
                Serving All Provinces
              </h3>
              <p className="text-lg text-black/80 leading-relaxed">
                We deliver our exquisite craftsmanship to every corner of
                Pakistan, ensuring your bespoke pieces reach you with the same
                care they were created with.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🚚</span>
                  <span className="font-medium text-black/80">
                    Express Delivery
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📦</span>
                  <span className="font-medium text-black/80">
                    Secure Packaging
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📍</span>
                  <span className="font-medium text-black/80">
                    Nationwide Coverage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gold-500/2 to-white/95">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 text-center mb-16 font-bold font-serif">
            Meet Our Artisans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${founder})` }}
              ></div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-semibold text-black mb-2">
                  Sarah Khan
                </h3>
                <p className="text-gold-500 font-medium mb-4">
                  Founder & Creative Director
                </p>
                <p className="text-black/80 leading-relaxed">
                  With 15+ years in haute couture, Sarah blends traditional
                  techniques with contemporary vision.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${team1})` }}
              ></div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-semibold text-black mb-2">
                  Ahmed Patel
                </h3>
                <p className="text-gold-500 font-medium mb-4">Master Tailor</p>
                <p className="text-black/80 leading-relaxed">
                  Ahmed's precision and expertise ensure every garment fits like
                  a second skin.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${workshop})` }}
              ></div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-semibold text-black mb-2">
                  Maria Rodriguez
                </h3>
                <p className="text-gold-500 font-medium mb-4">
                  Embroidery Specialist
                </p>
                <p className="text-black/80 leading-relaxed">
                  Maria's intricate handwork brings fabrics to life with
                  stunning artistry and detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 text-center mb-16 font-bold font-serif">
            Our Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Artisanal Craftsmanship
              </h3>
              <p className="text-black/80 leading-relaxed">
                Every piece is handcrafted with meticulous attention to detail
                and quality.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">🤝</div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Personalized Service
              </h3>
              <p className="text-black/80 leading-relaxed">
                Your unique vision guides our creative process, ensuring truly
                bespoke results.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">🌱</div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Sustainable Fashion
              </h3>
              <p className="text-black/80 leading-relaxed">
                We prioritize ethical materials and timeless designs that stand
                the test of time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-6xl mb-6">❤️</div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                Passion for Excellence
              </h3>
              <p className="text-black/80 leading-relaxed">
                Our love for fashion drives us to create pieces that inspire and
                empower.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gold-500/10 to-gold-500/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-6">
            Ready to Create Something Extraordinary?
          </h2>
          <p className="text-xl text-black/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your vision and bring it to life with our expert
            craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="#contact"
              className="bg-gold-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Book Consultation
            </a>
            <a
              href="#portfolio"
              className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-full font-semibold hover:bg-gold-500 hover:text-white transition-all duration-300"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
