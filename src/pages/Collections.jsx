import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Collections() {
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-gold-500/5 via-white to-gold-500/5 py-12 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-4">
            Our Collections
          </h1>
          <p className="text-lg text-black/70">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="py-12 px-4 text-center bg-gradient-to-br from-gold-500/2 to-white/98">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-4">
            Collections
          </h1>
          <p className="text-base md:text-lg text-black/70">
            Error loading collections: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gold-500/5 via-white to-gold-500/5 py-12 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-3 tracking-tight">
            Our Collections
          </h1>
          <p className="text-sm md:text-base text-black/70 max-w-xl mx-auto leading-relaxed font-light">
            Explore our curated collections, each showcasing the finest
            craftsmanship and traditional designs.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.keys(groupedProducts).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedProducts).map(
              ([category, categoryProducts]) => (
                <div
                  key={category}
                  className="bg-white rounded-2xl shadow-lg border border-gold-500/20 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-6 text-white">
                    <h2 className="text-xl font-bold font-serif mb-2">
                      {category}
                    </h2>
                    <p className="text-gold-100 text-sm">
                      {categoryProducts.length}{" "}
                      {categoryProducts.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  {/* Products Preview */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
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

                    {/* View All Button */}
                    <button
                      className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-4 rounded-lg font-bold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category);
                      }}
                    >
                      View All {category}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
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
    </div>
  );
}
