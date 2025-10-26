import React from "react";
import heroImage from "../../assets/hero.jpg";

const cards = [
  {
    id: 1,
    title: "Royal Embroidery Gown",
    image: heroImage,
  },
  {
    id: 2,
    title: "Silk Hand-Stitched Sherwani",
    image: heroImage,
  },
  {
    id: 3,
    title: "Modern Luxe Lehenga",
    image: heroImage,
  },
];

export default function CardsSection() {
  return (
    <section className="cards-section">
      <div className="cards-grid container-inline">
        {cards.map((card) => (
          <article key={card.id} className="product-card">
            <div
              className="product-image"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="product-overlay">
              <div className="product-info">
                <h3 className="product-title">{card.title}</h3>
                <div className="product-actions">
                  <button className="btn-gold">Buy Now</button>
                  <button className="btn-gray">Learn More</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
