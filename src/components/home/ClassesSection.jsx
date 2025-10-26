import React from "react";

const classes = ["Wedding", "Casual", "Formals", "Bridal", "Accessories"];

export default function ClassesSection() {
  return (
    <section className="classes-section">
      <div className="section-header">
        <h2>Explore Our Collections</h2>
        <p>Handpicked styles for every occasion</p>
      </div>

      <div className="classes-inner">
        {classes.map((c) => (
          <button key={c} className="class-pill">
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}
