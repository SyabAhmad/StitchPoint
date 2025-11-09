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
      <section className="py-16 bg-gradient-to-br from-gold-500/2 via-white to-gold-500/2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-4">
            Our Collections
          </h2>
          <p className="text-lg text-black/70">Loading collections...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gold-500/2 via-white to-gold-500/2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-4">
            Our Collections
          </h2>
          <p className="text-base md:text-lg text-black/70">
            Error loading collections: {error}
          </p>
        </div>
      </section>
    );
  }

  const categories = Object.keys(groupedProducts);
  const limitedCategories = categories.slice(0, 6); // Show up to 6 categories

  return (
    <section className="py-16 bg-gradient-to-br from-gold-500/2 via-white to-gold-500/2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-4 tracking-tight">
            Our Collections
          </h2>
          <p className="text-sm md:text-base text-black/70 max-w-2xl mx-auto leading-relaxed font-light">
            Discover our curated collections, each showcasing the finest
            craftsmanship and traditional designs.
          </p>
        </div>

        {/* Collections Grid */}
        {limitedCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {limitedCategories.map((category) => {
                const categoryProducts = groupedProducts[category];
                return (
                  <div
                    key={category}
                    className="bg-white rounded-2xl shadow-lg border border-gold-500/20 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-4 text-white">
                      <h3 className="text-lg font-bold font-serif mb-1">
                        {category}
                      </h3>
                      <p className="text-gold-100 text-xs">
                        {categoryProducts.length}{" "}
                        {categoryProducts.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    {/* Products Preview */}
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {categoryProducts.slice(0, 4).map((product) => (
                          <div
                            key={product.id}
                            className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group/product"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                          >
                            {product.image_url ? (
                              <img
                                src={`http://127.0.0.1:5000${product.image_url}`}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${
                                product.image_url ? "hidden" : "flex"
                              } bg-gradient-to-br from-gold-100 to-gold-200`}
                            >
                              <span className="text-xs font-bold text-center px-1">
                                {product.name && product.name.charAt
                                  ? product.name.charAt(0).toUpperCase()
                                  : "?"}
                              </span>
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full">
                                View
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View Category Button */}
                      <button
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-3 rounded-lg font-bold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 text-xs"
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
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black/80 px-8 py-3 rounded-lg font-bold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Collections
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-black/60 bg-white rounded-3xl shadow-xl border border-gold-500/10">
            <p className="text-2xl font-semibold mb-4 text-gold-500">
              No collections found!
            </p>
            <p className="text-lg mb-3">
              It seems there are no products available at the moment.
            </p>
            <p className="text-md">
              Please check back later for our latest collections.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
