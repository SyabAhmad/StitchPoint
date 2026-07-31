import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";
import { FaShoppingCart, FaStar } from "react-icons/fa";

export default function TopSaleProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopSaleProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products/top-sales");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopSaleProducts();
  }, []);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < Math.floor(rating || 0) ? "text-gold-500 text-[10px]" : "text-black/10 text-[10px]"} />
      ))}
    </div>
  );

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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <span className="text-red-500 text-xs font-semibold tracking-[0.2em] uppercase">
              Limited Time
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-black mt-2">
              Top Sale
            </h2>
          </div>
          <a href="/shop" className="mt-3 md:mt-0 text-gold-500 text-xs font-semibold hover:text-gold-600 transition-colors">
            Shop All Deals →
          </a>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="group bg-black/[0.02] rounded-xl overflow-hidden border border-black/5 hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black/[0.03]">
                  {product.image_url ? (
                    <img
                      src={`http://127.0.0.1:5000${product.image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 items-center justify-center bg-black/[0.04] ${product.image_url ? "hidden" : "flex"}`}>
                    <span className="text-3xl font-serif text-black/10">{product.name?.charAt(0)}</span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {product.sale_type}
                    </span>
                    <span className="bg-black text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {product.sale_discount_percentage}% OFF
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold-500 hover:text-white text-black/50"
                  >
                    <FaShoppingCart className="text-xs" />
                  </button>
                </div>

                <div className="p-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {renderStars(product.average_rating)}
                    <span className="text-[10px] text-black/25">({product.review_count || 0})</span>
                  </div>
                  <h3 className="text-sm font-semibold text-black truncate mb-0.5">{product.name}</h3>
                  <p className="text-[11px] text-black/30 mb-2">{product.store_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-black/25 text-xs line-through">PKR {product.price.toLocaleString()}</span>
                    <span className="text-black font-bold text-sm">
                      PKR {(product.price * (1 - product.sale_discount_percentage / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-black/25 text-sm">No sale products at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
