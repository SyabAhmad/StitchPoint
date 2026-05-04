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
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 border border-black/20 text-black text-sm font-bold tracking-[0.3em] uppercase mb-6">
            Explore Categories
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            OUR COLLECTIONS
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Discover our curated collections, each showcasing the finest
            craftsmanship and traditional designs.
          </p>
        </div>

        {/* Collections Grid */}
        {limitedCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {limitedCategories.map((category) => {
                const categoryProducts = groupedProducts[category];
                return (
                  <div
                    key={category}
                    className="group relative bg-black/5 border border-black/10 hover:border-black/30 transition-all duration-500 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                    {/* Category Header */}
                    <div className="p-6 border-b border-black/10">
                      <h3 className="text-xl font-bold text-black mb-2 tracking-wide group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {category.toUpperCase()}
                      </h3>
                      <p className="text-gray-500 text-sm tracking-wider">
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
                            className="aspect-square bg-black/5 border border-black/10 overflow-hidden relative group/product"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                          >
                            {product.image_url ? (
                              <img
                                src={`http://127.0.0.1:5000${product.image_url}`}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${
                                product.image_url ? "hidden" : "flex"
                              } bg-black/5`}
                            >
                              <span className="text-xl font-bold text-black">
                                {product.name && product.name.charAt
                                  ? product.name.charAt(0).toUpperCase()
                                  : "?"}
                              </span>
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-sm font-bold bg-black/60 px-4 py-2">
                                VIEW
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View Category Button */}
                      <button
                        className="w-full py-3 bg-black text-white font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300"
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
                className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
              >
                View All Collections
                <span className="text-xl">→</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-black/5 border border-black/10">
            <div className="text-6xl mb-6">📦</div>
            <p className="text-2xl font-bold text-black mb-4">
              No collections found!
            </p>
            <p className="text-lg text-gray-500 mb-3">
              It seems there are no products available at the moment.
            </p>
            <p className="text-md text-gray-400">
              Please check back later for our latest collections.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
