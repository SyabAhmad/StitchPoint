import React from "react";
import heroImage from "../../assets/hero.jpg";

const arrivals = [
  { id: 1, name: "Satin Cape", image: heroImage },
  { id: 2, name: "Embroidered Shawl", image: heroImage },
  { id: 3, name: "Silk Scarf", image: heroImage },
];

export default function NewArrivals() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gold-500/2 to-white/98">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-gold-500 text-center mb-8">
          New Arrivals
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {arrivals.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${a.image})` }}
            />
            <div className="p-6 flex justify-between items-center gap-4">
              <strong className="text-lg font-semibold text-black">
                {a.name}
              </strong>
              <button className="bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
