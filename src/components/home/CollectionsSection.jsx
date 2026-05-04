import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CollectionsSection() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const prods = data.products || [];

        // Group products by category
        const grouped = prods.reduce((acc, product) => {
          const category = product.category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        setGroupedProducts(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to shop with category filter
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const handleProductClick = (product) => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleViewAllCollections = () => {
    navigate("/collections");
  };

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-white via-gold-500/5 to-white relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-sm font-medium tracking-wide uppercase mb-6">
            Curated For You
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-800 mb-6 tracking-wide">
            Our <span className="text-gold-500">Collections</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
            <p className="text-lg">Loading collections...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-white via-gold-500/5 to-white relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-sm font-medium tracking-wide uppercase mb-6">
            Error
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-800 mb-6">
            Our <span className="text-gold-500">Collections</span>
          </h2>
          <p className="text-lg text-gray-600">
            Error loading collections: {error}
          </p>
        </div>
      </section>
    );
  }

  const categories = Object.keys(groupedProducts);
  const limitedCategories = categories.slice(0, 6); // Show up to 6 categories

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-white via-gold-500/5 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-sm font-medium tracking-wide uppercase mb-6">
            Explore Categories
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-800 mb-6 tracking-wide">
            Our <span className="text-gold-500">Collections</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collections, each showcasing the finest
            craftsmanship and traditional designs.
          </p>
        </div>

        {/* Collections Grid */}
        {limitedCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
              {limitedCategories.map((category) => {
                const categoryProducts = groupedProducts[category];
                return (
                  <div
                    key={category}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-gold-500/20 transition-all duration-500 cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-gold-500/10"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-gold-500/10 to-gold-500/5 p-6 border-b border-gold-500/10">
                      <h3 className="text-2xl font-bold font-serif text-gray-800 mb-2 group-hover:text-gold-500 transition-colors duration-300">
                        {category}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {categoryProducts.length}{" "}
                        {categoryProducts.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    {/* Products Preview */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {categoryProducts.slice(0, 4).map((product) => (
                          <div
                            key={product.id}
                            className="aspect-square rounded-xl overflow-hidden bg-white/5 relative group/product border border-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                          >
                            {product.image_url ? (
                              <img
                                src={`http://127.0.0.1:5000${product.image_url}`}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${
                                product.image_url ? "hidden" : "flex"
                              } bg-gradient-to-br from-gold-500/20 to-gold-500/5`}
                            >
                              <span className="text-2xl font-bold text-gold-500">
                                {product.name && product.name.charAt
                                  ? product.name.charAt(0).toUpperCase()
                                  : "?"}
                              </span>
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                                View
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View Category Button */}
                      <button
                        className="w-full py-3 bg-transparent border border-gold-500/30 text-gold-500 rounded-xl font-semibold hover:bg-gold-500 hover:text-black-naqsh transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gold-500/25"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(category);
                        }}
                      >
                        View {category}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Collections Button */}
            <div className="text-center">
              <button
                onClick={handleViewAllCollections}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gold-500 text-black-naqsh font-bold rounded-xl hover:bg-gold-600 hover:shadow-2xl hover:shadow-gold-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                View All Collections
                <span className="text-xl">→</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gold-500/10">
            <div className="text-6xl mb-6">📦</div>
            <p className="text-2xl font-bold text-gray-800 mb-4">
              No collections found!
            </p>
            <p className="text-lg text-gray-600 mb-3">
              It seems there are no products available at the moment.
            </p>
            <p className="text-md text-gray-500">
              Please check back later for our latest collections.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
