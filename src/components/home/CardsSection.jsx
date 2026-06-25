import React, { useState, useEffect } from "react";
import { addToWishlist, isInWishlist } from "../../utils/wishlistUtils";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function CardsSection() {
  const [products, setProducts] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlistStatus = async (prods) => {
      const wishlistPromises = prods.map((p) => isInWishlist(p.id));
      const results = await Promise.allSettled(wishlistPromises);
      const status = {};
      prods.forEach((p, index) => {
        const result = results[index];
        if (result.status === "fulfilled") {
          status[p.id] = result.value;
        } else {
          console.error(
            `Failed to check wishlist status for product ${p.id}:`,
            result.reason,
          );
          status[p.id] = false; // Safe default
        }
      });
      setWishlistStatus(status);
    };

    const fetchFeaturedProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
        if (!import.meta.env.VITE_API_URL) {
          console.error(
            "VITE_API_URL environment variable is not set. Using fallback: http://127.0.0.1:5000",
          );
        }
        const response = await fetch(`${apiUrl}/api/products/featured`);
        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }
        const data = await response.json();
        const fetchedProducts = data.products || [];
        setProducts(fetchedProducts);
        await checkWishlistStatus(fetchedProducts);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist({ id: productId });
      setWishlistStatus((prev) => ({ ...prev, [productId]: true }));
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const handleProductClick = (product) => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const renderStars = (rating, reviewCount) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }

    return (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{stars}</div>
          <span className="text-gray-600 text-sm">({reviewCount})</span>
        </div>
    );
  };

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 border border-black/20 text-black text-sm font-bold tracking-[0.3em] uppercase mb-6">
            Handpicked for You
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            FEATURED PRODUCTS
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Discover our handpicked selection of premium fashion pieces, crafted
            with elegance and precision
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <article
                key={product.id}
                className="group relative bg-black/5 border border-black/10 hover:border-black/30 transition-all duration-500 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div
                  className="relative h-[380px] bg-cover bg-center overflow-hidden grayscale group-hover:grayscale-0"
                  style={{
                    backgroundImage: `url(${
                      product.image_url || "/placeholder.jpg"
                    })`,
                  }}
                >
                  {/* Sale Badge */}
                  {product.sale_type && product.sale_discount_percentage && (
                    <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 tracking-wide">
                      {product.sale_discount_percentage}% OFF
                    </div>
                  )}

                  {/* Quick Actions (visible on hover) */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="flex-1 bg-white text-black py-3 font-bold tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product.id);
                      }}
                      className={`px-4 py-3 font-bold transition-all duration-300 text-sm ${
                        wishlistStatus[product.id]
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {wishlistStatus[product.id] ? "♥" : "♡"}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-white">
                  {/* Store Name */}
                  {product.store_name && (
                    <p className="text-gray-500 text-sm mb-2 font-bold tracking-wider">
                      {product.store_name.toUpperCase()}
                    </p>
                  )}

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-black mb-3 tracking-wide group-hover:text-gray-700 transition-colors duration-300">
                    {product.name.toUpperCase()}
                  </h3>

                  {/* Rating */}
                  {renderStars(
                    product.average_rating || 0,
                    product.review_count || 0,
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-3 mt-4">
                    {product.sale_type && product.sale_discount_percentage ? (
                      <>
                        <p className="text-gray-400 font-bold text-lg line-through">
                          PKR{product.price}
                        </p>
                        <p className="text-black font-bold text-xl">
                          PKR
                          {(
                            product.price *
                            (1 - product.sale_discount_percentage / 100)
                          ).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-black font-bold text-xl">
                        PKR {product.price}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-black/5 border border-black/10">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg text-gray-500 mb-2">No featured products available.</p>
              <p className="text-sm text-gray-400">Please check back later for new arrivals.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CardsSection;
