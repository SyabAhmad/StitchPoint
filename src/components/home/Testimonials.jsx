import React from "react";

const quotes = [
  {
    id: 1,
    name: "Aisha",
    text: "Absolutely love my wedding dress — the detail was perfect.",
  },
  {
    id: 2,
    name: "Omar",
    text: "Incredible craftsmanship. Highly recommended.",
  },
  {
    id: 3,
    name: "Mariyam",
    text: "Fast turnaround and exquisite finishing touches.",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section !text-(--black-naqsh)">
      <div className="container-inline">
        <h3 className="section-heading">What clients say</h3>
      </div>
      <div className="testimonials-grid container-inline">
        {quotes.map((q) => (
          <blockquote
            key={q.id}
            className="testimonial-card !bg-(--gold-600) text-(--black-naqsh)"
          >
            <p className="testimonial-text">“{q.text}”</p>
            <footer className="testimonial-author">— {q.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
