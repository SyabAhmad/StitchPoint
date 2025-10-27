import React from "react";

const services = [
  {
    id: 1,
    title: "Bespoke Tailoring",
    desc: "Crafted to perfection with attention to every detail",
    icon: "✂️",
    features: [
      "Custom measurements",
      "Premium fabrics",
      "Expert craftsmanship",
    ],
  },
  {
    id: 2,
    title: "Hand Embroidery",
    desc: "Intricate threadwork that brings designs to life",
    icon: "🪡",
    features: ["Traditional techniques", "Custom patterns", "Fine detailing"],
  },
  {
    id: 3,
    title: "Restyling",
    desc: "Transform your cherished pieces into modern treasures",
    icon: "🧵",
    features: ["Vintage restoration", "Modern updates", "Sustainable fashion"],
  },
];

export default function FeaturedServices() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gold-500/2 to-white/98">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gold-500 mb-4">
          Our Services
        </h2>
        <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
          Experience the art of traditional craftsmanship with modern precision
        </p>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="mb-6">
                <div className="text-6xl p-4 bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20 inline-block">
                  {s.icon}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xl font-serif font-semibold text-black mb-4">
                  {s.title}
                </h4>
                <p className="text-black/80 leading-relaxed mb-6">{s.desc}</p>
                <ul className="text-left space-y-2">
                  {s.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-gold-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-white border-none px-6 py-3 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
