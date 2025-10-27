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
    <section className="py-20 px-4 bg-gradient-to-br from-black-silk/3 to-white/98">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card) => (
          <article
            key={card.id}
            className="relative overflow-hidden rounded-2xl min-h-[450px] flex flex-col bg-white shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div
              className="flex-1 bg-cover bg-center min-h-[380px]"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="absolute left-0 right-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-white">
                  {card.title}
                </h3>
                <div className="flex gap-4">
                  <button className="bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                    Buy Now
                  </button>
                  <button className="bg-gray-silk text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
