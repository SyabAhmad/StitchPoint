import COLOR_PALETTES from "../../../theme";

const BrandsSection = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const brands = [
    { id: 1, name: "Heritage Arts", logo: "HA", color: "from-gray-900 to-gray-800" },
    { id: 2, name: "Naqsh Studio", logo: "NS", color: "from-yellow-700 to-yellow-600" },
    { id: 3, name: "Silk Traditions", logo: "ST", color: "from-gray-800 to-gray-900" },
    { id: 4, name: "Craft Collective", logo: "CC", color: "from-yellow-600 to-yellow-700" },
    { id: 5, name: "Luxury Threads", logo: "LT", color: "from-gray-900 to-gray-800" },
    { id: 6, name: "Artisan Market", logo: "AM", color: "from-yellow-700 to-yellow-600" },
    { id: 7, name: "Modern Couture", logo: "MC", color: "from-gray-800 to-gray-900" },
    { id: 8, name: "Golden Stitch", logo: "GS", color: "from-yellow-500 to-yellow-600" },
  ];

  // Duplicate brands for seamless infinite loop
  const duplicateBrands = [...brands, ...brands];

  return (
    <section className="py-16 px-6 lg:px-12" style={{ backgroundColor: palette.background }}>
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .brands-scroll {
          animation: scrollLeft 30s linear infinite;
        }
        .brands-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: palette.primaryHeader }}>
            Featured Brands
          </h2>
          <p className="text-gray-600">Shop from trusted artisan brands</p>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="w-full overflow-hidden">
          <div className="brands-scroll flex gap-4">
            {duplicateBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 w-52 h-40 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div
                  className={`bg-gradient-to-br ${brand.color} w-full h-full flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl transition-all duration-500 border border-yellow-400/20 group-hover:border-yellow-400/50`}
                >
                  {/* Premium background effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  
                  {/* Shine effect on hover */}
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-500" />

                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 font-bold text-lg text-white group-hover:scale-110 transition-transform duration-300 border border-white/30">
                      {brand.logo}
                    </div>
                    <p className="text-white font-semibold text-sm">{brand.name}</p>
                    <p className="text-white/60 text-xs mt-1">Shop Now</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
