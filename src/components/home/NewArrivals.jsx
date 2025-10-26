import React from "react";
import heroImage from "../../assets/hero.jpg";

const arrivals = [
  { id: 1, name: "Satin Cape", image: heroImage },
  { id: 2, name: "Embroidered Shawl", image: heroImage },
  { id: 3, name: "Silk Scarf", image: heroImage },
];

export default function NewArrivals() {
  return (
    <section className="arrivals-section">
      <div className="container-inline">
        <h3 className="section-heading">New Arrivals</h3>
      </div>
      <div className="arrivals-grid container-inline">
        {arrivals.map((a) => (
          <div key={a.id} className="arrival-card">
            <div
              className="arrival-image"
              style={{ backgroundImage: `url(${a.image})` }}
            />
            <div className="arrival-info">
              <strong>{a.name}</strong>
              <button className="btn-gold">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
