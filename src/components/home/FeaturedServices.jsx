import React from "react";

const services = [
  {
    id: 1,
    title: "Bespoke Tailoring",
    desc: "Crafted to perfection with attention to every detail",
    image: "https://images.unsplash.com/photo-1594933832501-0b8d2d4f2c3?w=400&h=300&fit=crop",
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
    <section className="py-24 px-4 bg-gradient-to-br from-white via-gold-500/5 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-sm font-medium tracking-wide uppercase mb-6">
            What We Offer
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-800 mb-6 tracking-wide">
            Our <span className="text-gold-500">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the art of traditional craftsmanship with modern precision
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((s) => (
              <div
                key={s.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 hover:border-gold-500/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={s.image} 
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-gold-500 to-gold-600 items-center justify-center text-6xl text-white absolute inset-0">
                    {s.title.charAt(0)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="text-xl font-serif font-bold text-gray-800 mb-3 group-hover:text-gold-500 transition-colors duration-300">
                    {s.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {s.desc}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {s.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="text-gold-500 text-xs">●</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full py-2.5 bg-gold-500 text-white rounded-lg font-medium text-sm hover:bg-gold-600 transition-all duration-300 shadow-sm hover:shadow-md">
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
