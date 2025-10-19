import { useState } from "react";
import COLOR_PALETTES from "../../theme";

const ShopPage = () => {
  const palette = COLOR_PALETTES.luxuryCouture;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedFilters, setSelectedFilters] = useState({
    sizes: [],
    colors: [],
    priceRange: [0, 10000],
    shippingCountries: [],
    materials: [],
  });

  // Mock products data
  const [products] = useState([
    {
      id: 1,
      title: "Luxury Embroidered Kurta",
      price: 4500,
      originalPrice: 5000,
      rating: 5,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1595777707802-41dc49dd4018?w=500&h=600&fit=crop",
      category: "Kurta",
      size: ["S", "M", "L", "XL"],
      color: ["Gold", "Black"],
      material: "Cotton",
      shipping: ["India", "USA", "UK"],
      discount: 10,
    },
    {
      id: 2,
      title: "Gold Threaded Dupatta",
      price: 2800,
      originalPrice: 3500,
      rating: 4,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop",
      category: "Dupatta",
      size: ["One Size"],
      color: ["Gold", "Silver"],
      material: "Silk",
      shipping: ["India", "USA", "UAE"],
      discount: 20,
    },
    {
      id: 3,
      title: "Handwoven Shawl",
      price: 3200,
      originalPrice: 3800,
      rating: 5,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop",
      category: "Shawl",
      size: ["One Size"],
      color: ["Maroon", "Black"],
      material: "Wool",
      shipping: ["India", "USA", "UK"],
      discount: 15,
    },
    {
      id: 4,
      title: "Classic Saree",
      price: 5500,
      originalPrice: 6500,
      rating: 5,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop",
      category: "Saree",
      size: ["One Size"],
      color: ["Red", "Gold"],
      material: "Silk",
      shipping: ["India", "USA", "UK", "UAE"],
      discount: 15,
    },
    {
      id: 5,
      title: "Designer Lehenga",
      price: 8900,
      originalPrice: 10000,
      rating: 5,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop",
      category: "Lehenga",
      size: ["XS", "S", "M", "L"],
      color: ["Gold", "Pink"],
      material: "Silk",
      shipping: ["India", "USA", "UK"],
      discount: 11,
    },
    {
      id: 6,
      title: "Silk Blend Fabric",
      price: 1200,
      originalPrice: 1500,
      rating: 4,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=600&fit=crop",
      category: "Fabric",
      size: ["One Size"],
      color: ["Cream", "Black"],
      material: "Silk",
      shipping: ["India", "USA"],
      discount: 20,
    },
    {
      id: 7,
      title: "Embroidered Jacket",
      price: 3800,
      originalPrice: 4500,
      rating: 4,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=600&fit=crop",
      category: "Jacket",
      size: ["S", "M", "L", "XL"],
      color: ["Black", "Navy"],
      material: "Cotton",
      shipping: ["India", "USA", "UK", "UAE"],
      discount: 15,
    },
    {
      id: 8,
      title: "Beaded Clutch",
      price: 1500,
      originalPrice: 2000,
      rating: 5,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1539222788357-2c2352b20e00?w=500&h=600&fit=crop",
      category: "Accessories",
      size: ["One Size"],
      color: ["Gold", "Silver"],
      material: "Beaded",
      shipping: ["India", "USA", "UK"],
      discount: 25,
    },
    {
      id: 9,
      title: "Handmade Accessories",
      price: 2200,
      originalPrice: 2800,
      rating: 5,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1548299297-e2e5bf3c7f3f?w=500&h=600&fit=crop",
      category: "Accessories",
      size: ["One Size"],
      color: ["Multi"],
      material: "Handmade",
      shipping: ["India", "USA"],
      discount: 21,
    },
  ]);

  const sizes = ["XS", "S", "M", "L", "XL", "One Size"];
  const colors = ["Gold", "Black", "Silver", "Red", "Pink", "Maroon", "Navy", "Cream"];
  const shippingCountries = ["India", "USA", "UK", "UAE", "Canada", "Australia"];
  const materials = ["Cotton", "Silk", "Wool", "Beaded", "Handmade"];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = selectedFilters.sizes.length === 0 ||
                        selectedFilters.sizes.some(size => product.size.includes(size));
    const matchesColor = selectedFilters.colors.length === 0 ||
                         selectedFilters.colors.some(color => product.color.includes(color));
    const matchesPrice = product.price >= selectedFilters.priceRange[0] &&
                         product.price <= selectedFilters.priceRange[1];
    const matchesShipping = selectedFilters.shippingCountries.length === 0 ||
                            selectedFilters.shippingCountries.some(country => product.shipping.includes(country));
    const matchesMaterial = selectedFilters.materials.length === 0 ||
                            selectedFilters.materials.some(material => product.material.includes(material));

    return matchesSearch && matchesSize && matchesColor && matchesPrice && matchesShipping && matchesMaterial;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      const current = prev[filterType] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [filterType]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [filterType]: [...current, value],
        };
      }
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      sizes: [],
      colors: [],
      priceRange: [0, 10000],
      shippingCountries: [],
      materials: [],
    });
    setSearchTerm("");
  };

  return (
    <div style={{ backgroundColor: palette.background }}>
      {/* Welcome Section with Benefits */}
      <section className="py-12 px-6 lg:px-12" style={{ backgroundColor: palette.primaryHeader }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Welcome to Our Collection</h1>
            <p className="text-lg text-gray-300">Discover authentic handcrafted luxury items from artisans worldwide</p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders over Rs. 2000" },
              { icon: "🔒", title: "Secure Payment", desc: "100% safe transactions" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
              { icon: "🏆", title: "Authentic", desc: "Verified artisan products" },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-5xl mb-3">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-8 px-6 lg:px-12 border-b" style={{ borderColor: palette.accentButton + "30" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: palette.primaryHeader }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by product name, category..."
                className="w-full pl-12 pr-6 py-4 rounded-full border-2 focus:outline-none transition-all"
                style={{
                  borderColor: palette.accentButton,
                  backgroundColor: palette.background,
                  color: palette.primaryHeader,
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={clearFilters}
              className="px-6 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: palette.accentButton,
                color: palette.primaryHeader,
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Main Content - Filters + Products */}
      <div className="py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedFilters={selectedFilters}
              toggleFilter={toggleFilter}
              sizes={sizes}
              colors={colors}
              shippingCountries={shippingCountries}
              materials={materials}
              palette={palette}
              productCount={sortedProducts.length}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Header with Sort */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: palette.primaryHeader }}>
                Products ({sortedProducts.length})
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{
                  borderColor: palette.accentButton,
                  color: palette.primaryHeader,
                }}
              >
                <option value="latest">Latest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} palette={palette} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 mb-4">No products found matching your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: palette.accentButton,
                    color: palette.primaryHeader,
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({
  selectedFilters,
  toggleFilter,
  sizes,
  colors,
  shippingCountries,
  materials,
  palette,
  productCount,
}) => {
  return (
    <div className="sticky top-4 space-y-6">
      <div
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: palette.background,
          border: `2px solid ${palette.accentButton}30`,
        }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: palette.primaryHeader }}>
          Filters
        </h3>

        {/* Size Filter */}
        <FilterSection
          title="Size"
          items={sizes}
          selected={selectedFilters.sizes}
          onToggle={(value) => toggleFilter("sizes", value)}
          palette={palette}
        />

        {/* Color Filter */}
        <FilterSection
          title="Color"
          items={colors}
          selected={selectedFilters.colors}
          onToggle={(value) => toggleFilter("colors", value)}
          palette={palette}
          isColor
        />

        {/* Material Filter */}
        <FilterSection
          title="Material"
          items={materials}
          selected={selectedFilters.materials}
          onToggle={(value) => toggleFilter("materials", value)}
          palette={palette}
        />

        {/* Shipping Countries Filter */}
        <FilterSection
          title="Ship To"
          items={shippingCountries}
          selected={selectedFilters.shippingCountries}
          onToggle={(value) => toggleFilter("shippingCountries", value)}
          palette={palette}
        />

        {/* Price Range Filter */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-4" style={{ color: palette.primaryHeader }}>
            Price Range
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Rs. {selectedFilters.priceRange[0]}</span>
              <span>Rs. {selectedFilters.priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={selectedFilters.priceRange[1]}
              onChange={(e) =>
                toggleFilter("priceRange", [selectedFilters.priceRange[0], parseInt(e.target.value)])
              }
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: palette.accentButton + "10" }}>
          <p className="text-sm font-semibold" style={{ color: palette.primaryHeader }}>
            {productCount} Products Found
          </p>
        </div>
      </div>
    </div>
  );
};

// Filter Section Component
const FilterSection = ({ title, items, selected, onToggle, palette, isColor }) => {
  return (
    <div className="border-b pb-4 mb-4 last:border-b-0">
      <h4 className="font-semibold mb-3" style={{ color: palette.primaryHeader }}>
        {title}
      </h4>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 cursor-pointer"
            />
            {isColor ? (
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: getColorHex(item),
                    borderColor: palette.accentButton,
                  }}
                />
                <span className="text-sm group-hover:text-yellow-600 transition-colors">{item}</span>
              </div>
            ) : (
              <span className="text-sm group-hover:text-yellow-600 transition-colors">{item}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, palette }) => {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden h-80">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-bold"
            style={{ backgroundColor: palette.accentButton }}
          >
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
        <h3 className="font-bold text-sm mb-2 line-clamp-2" style={{ color: palette.primaryHeader }}>
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold" style={{ color: palette.accentButton }}>
            Rs. {product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">Rs. {product.originalPrice}</span>
          )}
        </div>

        {/* Button */}
        <button
          className="w-full py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: palette.accentButton,
            color: palette.primaryHeader,
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Helper function to get color hex
const getColorHex = (color) => {
  const colors = {
    Gold: "#D4AF37",
    Black: "#151515",
    Silver: "#C0C0C0",
    Red: "#DC143C",
    Pink: "#FFC0CB",
    Maroon: "#800000",
    Navy: "#000080",
    Cream: "#FFFDD0",
    Multi: "#FF69B4",
  };
  return colors[color] || "#999";
};

export default ShopPage;
