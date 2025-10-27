import React from "react";

const quotes = [
  {
    id: 1,
    name: "Aisha",
    text: "Absolutely love my wedding dress — the detail was perfect.",
    rating: 5,
    avatar: "👩‍💼",
    location: "Dubai",
  },
  {
    id: 2,
    name: "Omar",
    text: "Incredible craftsmanship. Highly recommended.",
    rating: 5,
    avatar: "👨‍💼",
    location: "Abu Dhabi",
  },
  {
    id: 3,
    name: "Mariyam",
    text: "Fast turnaround and exquisite finishing touches.",
    rating: 5,
    avatar: "👩‍🎨",
    location: "Sharjah",
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="testimonial-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container-inline">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Clients Say</h2>
          <p className="testimonials-subtitle">
            Trusted by discerning clients across the UAE
          </p>
        </div>
      </div>
      <div className="testimonials-grid container-inline">
        {quotes.map((q) => (
          <div key={q.id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">{q.avatar}</div>
              <div className="testimonial-meta">
                <StarRating rating={q.rating} />
                <div className="testimonial-location">{q.location}</div>
              </div>
            </div>
            <blockquote className="testimonial-content">
              <p className="testimonial-text">"{q.text}"</p>
              <footer className="testimonial-author">
                <strong>{q.name}</strong>
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
