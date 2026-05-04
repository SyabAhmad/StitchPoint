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
        <span className="text-white/70 text-sm">({reviewCount})</span>
      </div>
    );
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-black-silk/5 to-white/95">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gold-500 mb-6 tracking-wide">
          Featured Products
        </h2>
        <p className="text-xl md:text-2xl text-black/80 max-w-3xl mx-auto leading-relaxed font-light">
          Discover our handpicked selection of premium fashion pieces, crafted
          with elegance and precision
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <article
              key={product.id}
              className="relative overflow-hidden rounded-2xl min-h-[450px] flex flex-col bg-white shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div
                className="flex-1 bg-cover bg-center min-h-[380px] cursor-pointer"
                style={{
                  backgroundImage: `url(${
                    product.image_url || "/placeholder.jpg"
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute left-0 right-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 cursor-pointer">
                      {product.name}
                    </h3>
                    {renderStars(
                      product.average_rating || 0,
                      product.review_count || 0,
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      {product.sale_type &&
                        product.sale_discount_percentage && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            {product.sale_type} SALE
                          </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                      {product.sale_type && product.sale_discount_percentage ? (
                        <>
                          <p className="text-red-300 font-bold text-lg line-through">
                            ${product.price}
                          </p>
                          <p className="text-green-400 font-bold text-lg">
                            $
                            {(
                              product.price *
                              (1 - product.sale_discount_percentage / 100)
                            ).toFixed(2)}
                          </p>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                            {product.sale_discount_percentage}% OFF
                          </span>
                        </>
                      ) : (
                        <p className="text-gold-400 font-bold text-lg">
                          ${product.price}
                        </p>
                      )}
                    </div>
                    {product.store_name && (
                      <p className="text-white/70 text-sm">
                        By: {product.store_name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex-1"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product.id);
                      }}
                      className={`bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex-1 ${
                        wishlistStatus[product.id]
                          ? "bg-gold-500 text-black"
                          : ""
                      }`}
                    >
                      {wishlistStatus[product.id]
                        ? "In Wishlist"
                        : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-black/60">
            <p className="text-lg mb-2">No featured products available.</p>
            <p className="text-sm">Please check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CardsSection;
