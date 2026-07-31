import React from "react";
import { FaCut, FaHeart, FaSync } from "react-icons/fa";

const services = [
  {
    id: 1,
    title: "Bespoke Tailoring",
    description: "Custom-fitted garments crafted to your exact measurements and style preferences.",
    icon: FaCut,
    features: ["Custom measurements", "Premium fabrics", "Expert fitting"],
  },
  {
    id: 2,
    title: "Hand Embroidery",
    description: "Intricate threadwork and embellishments that elevate every piece to art.",
    icon: FaHeart,
    features: ["Traditional motifs", "Custom patterns", "Fine detailing"],
  },
  {
    id: 3,
    title: "Restyling",
    description: "Transform your cherished garments into contemporary pieces with modern flair.",
    icon: FaSync,
    features: ["Vintage revival", "Modern updates", "Sustainable approach"],
  },
];

export default function FeaturedServices() {
  return (
    <section id="services" className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
            What We Offer
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-black mt-2 mb-3">
            Our Services
          </h2>
          <p className="text-black/45 max-w-lg mx-auto text-sm leading-relaxed">
            Blending time-honored craftsmanship with contemporary precision to deliver garments of exceptional quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group p-6 rounded-xl border border-black/5 hover:border-gold-500/30 transition-all duration-300 hover:shadow-md"
              >
                <div className="w-11 h-11 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                  <Icon className="text-gold-500 text-base" />
                </div>
                <h3 className="text-base font-semibold text-black mb-2">
                  {service.title}
                </h3>
                <p className="text-black/45 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="space-y-1.5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-black/50">
                      <span className="w-1 h-1 rounded-full bg-gold-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
