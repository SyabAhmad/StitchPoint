import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function CollectionsSection() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
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
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = Object.keys(groupedProducts).slice(0, 6);

  if (loading) {
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-40 bg-black/5 rounded mx-auto" />
            <div className="h-3 w-52 bg-black/5 rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
            Browse By Style
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-black mt-2 mb-3">
            Our Collections
          </h2>
          <p className="text-black/45 max-w-lg mx-auto text-sm leading-relaxed">
            Curated collections showcasing the finest craftsmanship and traditional designs.
          </p>
        </div>

        {categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {categories.map((category) => {
                const items = groupedProducts[category];
                const first = items[0];
                return (
                  <div
                    key={category}
                    className="group relative rounded-xl overflow-hidden bg-black/[0.03] cursor-pointer aspect-[4/3]"
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(category)}`)}
                  >
                    {first?.image_url ? (
                      <img
                        src={`http://127.0.0.1:5000${first.image_url}`}
                        alt={category}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/[0.04] flex items-center justify-center">
                        <span className="text-4xl font-serif text-black/10">{category.charAt(0)}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-base font-semibold text-white mb-0.5">{category}</h3>
                      <p className="text-white/50 text-xs mb-2">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-gold-500 text-xs font-semibold group-hover:gap-2.5 transition-all duration-300">
                        Explore <FaArrowRight className="text-[10px]" />
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex gap-1">
                      {items.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          className="w-7 h-7 rounded overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm cursor-pointer hover:border-gold-500/50 transition-colors"
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                        >
                          {product.image_url && (
                            <img src={`http://127.0.0.1:5000${product.image_url}`} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/collections")}
                className="px-6 py-2.5 border border-black/10 rounded-lg text-xs font-semibold text-black/60 hover:border-gold-500 hover:text-gold-500 transition-all duration-200"
              >
                View All Collections
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-black/25 text-sm">No collections available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
