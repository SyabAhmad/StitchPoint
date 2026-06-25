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
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const handleProductClick = (product) => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-32 px-4 text-center">
          <div className="inline-block px-6 py-2 border border-black/20 text-black text-sm font-bold tracking-widest uppercase mb-6">
            COLLECTIONS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            OUR <span className="italic">COLLECTIONS</span>
          </h2>
          <p className="text-lg text-gray-400" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-32 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            OUR <span className="italic">COLLECTIONS</span>
          </h2>
          <p className="text-lg text-gray-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  const categories = Object.keys(groupedProducts);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="py-24 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 68v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 68v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 68v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 68v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block px-6 py-2 border border-black/20 text-black text-sm font-bold tracking-[0.3em] uppercase mb-6">
            DISCOVER
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            OUR <span className="italic">COLLECTIONS</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Explore our curated collections, each showcasing the finest craftsmanship and traditional designs that tell a story of heritage and elegance.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const categoryProducts = groupedProducts[category];
              return (
                <div
                  key={category}
                  className="group bg-white border border-black/10 hover:border-black/30 transition-all duration-500 cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  {/* Collection Banner */}
                  <div className="relative h-40 bg-black text-white p-6 flex flex-col justify-end overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`,
                      }}
                    ></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {category.toUpperCase()}
                      </h2>
                      <p className="text-white/70 text-sm tracking-wider mt-1">
                        {categoryProducts.length} {categoryProducts.length === 1 ? "ITEM" : "ITEMS"}
                      </p>
                    </div>
                  </div>

                  {/* Products Preview */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {categoryProducts.slice(0, 4).map((product) => (
                        <div
                          key={product.id}
                          className="aspect-square bg-black/5 border border-black/10 overflow-hidden relative group/product cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          {product.image_url ? (
                            <img
                              src={`http://127.0.0.1:5000${product.image_url}`}
                              alt={product.name}
                              className="w-full h-full object-cover grayscale group-hover/product:grayscale-0 transition-all duration-500"
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
                            <span className="text-2xl font-bold text-black">
                              {product.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-black/70 px-3 py-1.5 uppercase tracking-wider">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Button */}
                    <button
                      className="w-full py-3 bg-black text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-gray-800 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category);
                      }}
                    >
                      View Collection
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-black/10">
            <div className="text-6xl mb-6">✦</div>
            <p className="text-2xl font-bold text-black mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
              No Collections Yet
            </p>
            <p className="text-lg text-gray-500">
              Check back soon for our curated collections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}