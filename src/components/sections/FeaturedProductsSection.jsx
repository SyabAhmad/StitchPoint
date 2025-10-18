import COLOR_PALETTES from "../../../theme";
import ProductCard from "./ProductCard";

const FeaturedProductsSection = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const featuredCategories = [
    {
      id: 1,
      title: "New Arrivals",
      description: "Latest Collections",
      bgColor: "from-purple-500 to-pink-500",
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
      bgColor: "from-blue-500 to-cyan-500",
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
      bgColor: "from-orange-500 to-red-500",
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
    <section className="py-16 px-6 lg:px-12 bg-gray-50">
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
              className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-6 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 group relative overflow-hidden h-64`}
            >
              {/* Background effect */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <p className="text-sm opacity-90 mb-2">{category.description}</p>
                  <h3 className="text-2xl lg:text-3xl font-bold">{category.title}</h3>
                </div>
                <button
                  className="self-start px-6 py-2.5 bg-white rounded-full font-semibold transition-all duration-300 group-hover:scale-105"
                  style={{ color: category.bgColor.split(" ")[0] }}
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
