import COLOR_PALETTES from "../../../theme";

const BrandsSection = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const brands = [
    { id: 1, name: "Heritage Arts", logo: "HA", color: "from-blue-400 to-blue-600" },
    { id: 2, name: "Naqsh Studio", logo: "NS", color: "from-purple-400 to-purple-600" },
    { id: 3, name: "Silk Traditions", logo: "ST", color: "from-pink-400 to-pink-600" },
    { id: 4, name: "Craft Collective", logo: "CC", color: "from-orange-400 to-orange-600" },
    { id: 5, name: "Luxury Threads", logo: "LT", color: "from-red-400 to-red-600" },
    { id: 6, name: "Artisan Market", logo: "AM", color: "from-green-400 to-green-600" },
    { id: 7, name: "Modern Couture", logo: "MC", color: "from-indigo-400 to-indigo-600" },
    { id: 8, name: "Golden Stitch", logo: "GS", color: "from-yellow-400 to-yellow-600" },
  ];

  return (
    <section className="py-16 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: palette.primaryHeader }}>
            Featured Brands
          </h2>
          <p className="text-gray-600">Shop from trusted artisan brands</p>
        </div>

        {/* Horizontal Scrollable Section */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6 lg:-mx-12 lg:px-12">
          <div className="flex gap-4 min-w-max">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden cursor-pointer group"
              >
                <div
                  className={`bg-gradient-to-br ${brand.color} w-full h-full flex items-center justify-center relative overflow-hidden hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />

                  <div className="relative z-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {brand.logo}
                    </div>
                    <p className="text-white font-semibold text-sm">{brand.name}</p>
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
