import COLOR_PALETTES from "../../../theme";
import ProductCard from "./ProductCard";

const FeaturedProductsSection = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const featuredCategories = [
    {
      id: 1,
      title: "New Arrivals",
      description: "Latest Collections",
      bgGradient: "from-yellow-500 via-yellow-600 to-gray-900",
      icon: "✨",
      products: [
        {
          id: 101,
          image:
            "https://images.unsplash.com/photo-1595777707802-41dc49dd4018?w=400&h=400&fit=crop",
          title: "Luxury Embroidered Kurta",
          price: 4500,
          rating: 5,
          brand: "Naqsh Artisan",
          discount: 15,
        },
        {
          id: 102,
          image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
          title: "Gold Threaded Dupatta",
          price: 2800,
          rating: 4,
          brand: "Couture Silk",
          discount: 10,
        },
        {
          id: 103,
          image:
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop",
          title: "Handwoven Shawl",
          price: 3200,
          rating: 5,
          brand: "Heritage Textiles",
        },
      ],
    },
    {
      id: 2,
      title: "Best Sellers",
      description: "Customer Favorites",
      bgGradient: "from-gray-800 via-gray-900 to-yellow-700",
      icon: "⭐",
      products: [
        {
          id: 201,
          image:
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
          title: "Classic Saree",
          price: 5500,
          rating: 5,
          brand: "Traditional Arts",
          discount: 20,
        },
        {
          id: 202,
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
          title: "Designer Lehenga",
          price: 8900,
          rating: 5,
          brand: "Luxury Couture",
        },
        {
          id: 203,
          image:
            "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop",
          title: "Silk Blend Fabric",
          price: 1200,
          rating: 4,
          brand: "Textile Hub",
          discount: 5,
        },
      ],
    },
    {
      id: 3,
      title: "Trending Now",
      description: "This Season's Must-Have",
      bgGradient: "from-yellow-600 via-yellow-700 to-gray-800",
      icon: "🔥",
      products: [
        {
          id: 301,
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          title: "Embroidered Jacket",
          price: 3800,
          rating: 4,
          brand: "Modern Artisans",
          discount: 12,
        },
        {
          id: 302,
          image:
            "https://images.unsplash.com/photo-1539222788357-2c2352b20e00?w=400&h=400&fit=crop",
          title: "Beaded Clutch",
          price: 1500,
          rating: 5,
          brand: "Craft Collective",
        },
        {
          id: 303,
          image:
            "https://images.unsplash.com/photo-1548299297-e2e5bf3c7f3f?w=400&h=400&fit=crop",
          title: "Handmade Accessories",
          price: 2200,
          rating: 5,
          brand: "Artisan Gallery",
          discount: 8,
        },
      ],
    },
  ];

  return (
    <section className="py-16 px-6 lg:px-12" style={{ backgroundColor: palette.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: palette.primaryHeader }}>
            Featured Collections
          </h2>
          <p className="text-gray-600">Discover our curated selections</p>
        </div>

        {/* 3 Large Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredCategories.map((category) => (
            <div
              key={category.id}
              className={`bg-gradient-to-br ${category.bgGradient} rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-72 border border-yellow-400/30`}
            >
              {/* Premium background effect */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500" />
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <p className="text-sm font-semibold opacity-80 mb-2 tracking-wider uppercase">{category.description}</p>
                  <h3 className="text-3xl lg:text-4xl font-bold leading-tight">{category.title}</h3>
                </div>
                <button
                  className="self-start px-8 py-3 bg-white rounded-full font-bold transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                  style={{ color: palette.primaryHeader }}
                >
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Grid for each category */}
        {featuredCategories.map((category) => (
          <div key={category.id} className="mb-16">
            <h3 className="text-2xl font-bold mb-6" style={{ color: palette.primaryHeader }}>
              {category.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
