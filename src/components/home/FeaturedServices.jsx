import React from "react";

const services = [
  {
    id: 1,
    title: "Bespoke Tailoring",
    desc: "Crafted to perfection with attention to every detail",
    image: "https://images.unsplash.com/photo-1594933832501-0b8d2d4f2c3?w=400&h=300&fit=crop",
    features: ["Custom measurements", "Premium fabrics", "Expert craftsmanship"],
  },
  {
    id: 2,
    title: "Hand Embroidery",
    desc: "Intricate threadwork that brings designs to life",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    features: ["Traditional techniques", "Custom patterns", "Fine detailing"],
  },
  {
    id: 3,
    title: "Restyling",
    desc: "Transform your cherished pieces into modern treasures",
    image: "https://images.unsplash.com/photo-1483985988437-76770d740c3?w=400&h=300&fit=crop",
    features: ["Vintage restoration", "Modern updates", "Sustainable fashion"],
  },
];

export default function FeaturedServices() {
  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 border border-white/20 text-white text-sm font-bold tracking-[0.3em] uppercase mb-6">
            What We Offer
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wider"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            OUR SERVICES
          </h2>
          <p
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Experience the art of traditional craftsmanship with modern precision
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div
                key={s.id}
                className="group relative bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full bg-white items-center justify-center text-6xl text-black font-bold">
                    {s.title.charAt(0)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h4
                    className="text-xl font-bold text-white mb-3 tracking-wide group-hover:text-gray-200 transition-colors duration-300"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {s.title.toUpperCase()}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    {s.desc}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {s.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        <span className="text-sm tracking-wide">{feature.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full py-3 bg-white text-black font-bold tracking-widest uppercase text-sm hover:bg-gray-200 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}