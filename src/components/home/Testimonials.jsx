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
    <div className="flex gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < rating ? "text-gold-500 text-xl" : "text-gray-300 text-xl"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-black-silk/3 to-white/98">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gold-500 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
            Trusted by discerning clients across the UAE
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {quotes.map((q) => (
          <div
            key={q.id}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gold-500/10 to-gold-500/20 rounded-full border-2 border-gold-500/20">
                {q.avatar}
              </div>
              <div className="flex-1">
                <StarRating rating={q.rating} />
                <div className="text-sm text-black/60 font-medium">
                  {q.location}
                </div>
              </div>
            </div>
            <blockquote className="mb-6">
              <p className="text-lg leading-relaxed text-black/80 italic mb-4">
                "{q.text}"
              </p>
              <footer className="text-gold-500 font-bold text-lg">
                {q.name}
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
