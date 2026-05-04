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
    <section className="py-24 px-4 bg-gradient-to-br from-white via-gold-500/5 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-40 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-sm font-medium tracking-wide uppercase mb-6">
            Handpicked for You
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-800 mb-6 tracking-wide">
            Featured <span className="text-gold-500">Products</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium fashion pieces, crafted
            with elegance and precision
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.length > 0 ? (
            products.map((product) => (
              <article
                key={product.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gold-500/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-gold-500/20 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div
                  className="relative h-[380px] bg-cover bg-center overflow-hidden"
                  style={{
                    backgroundImage: `url(${
                      product.image_url || "/placeholder.jpg"
                    })`,
                  }}
                >
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black-naqsh via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Sale Badge */}
                  {product.sale_type && product.sale_discount_percentage && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
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
                      className="flex-1 bg-gold-500 text-white py-3 rounded-xl font-semibold hover:bg-[var(--gold-600)] transition-colors duration-300 shadow-lg text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product.id);
                      }}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                        wishlistStatus[product.id]
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
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
                    <p className="text-gold-500 text-sm mb-2 font-medium">
                      {product.store_name}
                    </p>
                  )}

                  {/* Product Name */}
                  <h3 className="text-xl font-serif font-semibold text-gray-800 mb-3 group-hover:text-gold-500 transition-colors duration-300">
                    {product.name}
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
                          ${product.price}
                        </p>
                        <p className="text-gold-500 font-bold text-xl">
                          $
                          {(
                            product.price *
                            (1 - product.sale_discount_percentage / 100)
                          ).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-gold-500 font-bold text-xl">
                        ${product.price}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-lg border border-gold-500/10">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg text-gray-600 mb-2">No featured products available.</p>
              <p className="text-sm text-gray-500">Please check back later for new arrivals.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CardsSection;
