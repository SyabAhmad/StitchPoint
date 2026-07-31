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
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const prods = data.products || [];

        const grouped = prods.reduce((acc, product) => {
          const category = product.category || "Uncategorized";
          if (!acc[category]) acc[category] = [];
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
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const handleProductClick = (product) => {
    if (product?.id) navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Collections</h1>
          <p className="text-gray-500">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collections</h1>
          <p className="text-gray-500">Error loading collections: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Collections</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Explore our curated collections, each showcasing the finest craftsmanship and traditional designs.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {Object.keys(groupedProducts).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div
                key={category}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gold-500 transition-colors cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {/* Category header */}
                <div className="bg-gold-500 px-5 py-4">
                  <h2 className="text-base font-bold text-black">{category}</h2>
                  <p className="text-xs text-black/60 mt-0.5">
                    {categoryProducts.length} {categoryProducts.length === 1 ? "item" : "items"}
                  </p>
                </div>

                {/* Products preview */}
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
                            className="w-full h-full object-cover group-hover/product:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-gold-100 to-gold-200 ${
                            product.image_url ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-xs font-bold text-gold-700">
                            {product.name?.charAt?.(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover/product:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover/product:opacity-100">
                          <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full">
                            View
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full bg-gold-500 text-black py-2 rounded-lg text-sm font-semibold hover:bg-gold-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category);
                    }}
                  >
                    View All {category}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 mb-2">No collections found</p>
            <p className="text-sm text-gray-500">It seems there are no products available at the moment.</p>
            <p className="text-sm text-gray-400 mt-1">Please check back later for our latest collections.</p>
          </div>
        )}
      </div>
    </div>
  );
}
