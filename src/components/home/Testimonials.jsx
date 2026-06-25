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
            i < rating ? "text-white text-xl" : "text-gray-600 text-xl"
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
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            WHAT OUR CLIENTS SAY
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Trusted by discerning clients across the UAE
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {quotes.map((q) => (
          <div
            key={q.id}
            className="bg-white/5 p-8 border border-white/10 hover:border-white/30 transition-all duration-300 relative group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl w-16 h-16 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                {q.avatar}
              </div>
              <div className="flex-1">
                <StarRating rating={q.rating} />
                <div className="text-sm text-gray-500 font-bold tracking-wider">
                  {q.location.toUpperCase()}
                </div>
              </div>
            </div>
            <blockquote className="mb-6">
              <p className="text-lg leading-relaxed text-gray-300 italic mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                "{q.text}"
              </p>
              <footer className="text-white font-bold text-lg tracking-wide">
                {q.name.toUpperCase()}
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
