import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import { addToCart } from "../utils/cartUtils";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../utils/wishlistUtils";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const StoreDetails = () => {
  const { store_id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState({});

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/stores/${store_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store");
        }
        const data = await response.json();
        setStore(data.store);

        // Check wishlist status for all products in parallel
        if (data.store && data.store.products) {
          const products = data.store.products;
          const wishlistResults = await Promise.all(
            products.map((product) => isInWishlist(product.id)),
          );
          const status = {};
          products.forEach((product, index) => {
            status[product.id] = wishlistResults[index];
          });
          setWishlistStatus(status);
        }
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    if (store_id) {
      fetchStore();
    }
  }, [store_id]);

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const isInWishlist = wishlistStatus[product.id];
      if (isInWishlist) {
        await removeFromWishlist(product);
        setWishlistStatus((prev) => ({ ...prev, [product.id]: false }));
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        await addToWishlist(product);
        setWishlistStatus((prev) => ({ ...prev, [product.id]: true }));
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch {
      toast.error("Failed to update wishlist");
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
        stars.push(<FaStar key={i} className="text-white" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-white opacity-50" />);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error: {error || "Store not found"}
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="px-6 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cccccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/collections")}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Back to Collections
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="w-40 h-40 bg-gradient-to-br from-gray-300 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl border-4 border-white">
              {store.logo_url ? (
                <img
                  src={`${API_BASE_URL}${store.logo_url}`}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaShoppingCart size={50} className="text-white" />
              )}
            </div>
            <div className="text-center lg:text-left text-white">
              <h1 className="text-5xl font-bold tracking-widest uppercase mb-4 text-white">
                {store.name}
              </h1>
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(store.average_rating || 0)
                          ? "text-white"
                          : "text-white/50"
                      }
                      size={20}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold">
                  {store.average_rating
                    ? `${store.average_rating}`
                    : "No rating"}{" "}
                  ({store.total_reviews || 0} reviews)
                </span>
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center justify-center lg:justify-start">
                  <FaMapMarkerAlt className="mr-3 text-white" />
                  <span className="text-lg">{store.address}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <FaPhone className="mr-3 text-white" />
                  <span className="text-lg">{store.contact_number}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-8">
            <p className="text-gray-300 text-xl leading-relaxed max-w-3xl">
              {store.description}
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-widest uppercase text-gray-900 mb-6">
            PRODUCTS
          </h2>
          {store.products.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No products available from this store.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={
                        product.image_url
                          ? `${API_BASE_URL}${product.image_url}`
                          : "/placeholder-image.jpg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 border ${
                        wishlistStatus[product.id]
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-200 hover:border-black"
                      }`}
                    >
                      <FaHeart size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">
                      {product.name}
                    </h3>
                    {renderStars(
                      product.average_rating || 0,
                      product.review_count || 0,
                    )}
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="font-bold text-base"
                        style={{ color: "#ffffff" }}
                      >
                        PKR {product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.stock_quantity === 0}
                      className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor:
                          product.stock_quantity > 0 ? "#ffffff" : "#9ca3af",
                        color: "#000000",
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#cccccc";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                        }
                      }}
                    >
                      <FaShoppingCart size={16} />
                      <span>
                        {product.stock_quantity > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
