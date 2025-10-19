import COLOR_PALETTES from "../../../theme";

const HeroCards = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const heroCards = [
    {
      id: 1,
      title: "Summer Collection",
      image: "https://images.unsplash.com/photo-1595777707802-41dc49dd4018?w=600&h=900&fit=crop",
      tag: "New",
    },
    {
      id: 2,
      title: "Wedding Special",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=900&fit=crop",
      tag: "Exclusive",
    },
    {
      id: 3,
      title: "Designer Edit",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=900&fit=crop",
      tag: "Trending",
    },
  ];

  return (
    <section className="py-8 px-6 lg:px-12" style={{ backgroundColor: palette.background }}>
      <div className="max-w-7xl mx-auto">
        {/* 3 Tall Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {heroCards.map((card) => (
            <div
              key={card.id}
              className="relative group h-80 md:h-80 lg:h-160 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 group-hover:via-black/40 transition-all duration-500" />

              {/* Tag */}
              <div className="absolute top-6 right-6 z-20">
                <span
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white border-2"
                  style={{ borderColor: palette.accentButton, backgroundColor: palette.accentButton + "20" }}
                >
                  {card.tag}
                </span>
              </div>

              {/* Content - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col justify-end h-full">
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {card.title}
                  </h3>
                  <button
                    className="w-fit px-8 py-3 bg-white rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ color: palette.primaryHeader }}
                  >
                    Explore Now →
                  </button>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCards;
