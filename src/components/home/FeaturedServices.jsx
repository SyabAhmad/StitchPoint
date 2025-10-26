import React from "react";

const services = [
  {
    id: 1,
    title: "Bespoke Tailoring",
    desc: "Made-to-measure garments",
    icon: "✂️",
  },
  {
    id: 2,
    title: "Hand Embroidery",
    desc: "Artisan detailing and threadwork",
    icon: "🪡",
  },
  {
    id: 3,
    title: "Restyling",
    desc: "Update heirlooms and vintage pieces",
    icon: "🧵",
  },
];

export default function FeaturedServices() {
  return (
    <section className="services-section">
      <div className="container-inline">
        {services.map((s) => (
          <div key={s.id} className="service-item">
            <div className="service-icon" aria-hidden>
              {s.icon}
            </div>
            <h4 className="service-title">{s.title}</h4>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
