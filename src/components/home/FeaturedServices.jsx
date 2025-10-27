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
    <section className="services-section">
      <div className="services-header">
        <h2 className="services-title">Our Services</h2>
        <p className="services-subtitle">
          Experience the art of traditional craftsmanship with modern precision
        </p>
      </div>
      <div className="container-inline">
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon" aria-hidden>
                  {s.icon}
                </div>
              </div>
              <div className="service-content">
                <h4 className="service-title">{s.title}</h4>
                <p className="service-desc">{s.desc}</p>
                <ul className="service-features">
                  {s.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="service-cta">
                <button className="service-btn">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
