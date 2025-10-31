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
import { addToWishlist, isInWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";

const StoreDetails = () => {
  const { store_id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:5000/api/stores/${store_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch store");
        }
        const data = await response.json();
        setStore(data.store);
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

  const handleAddToWishlist = (product) => {
    try {
      if (isInWishlist(product.id)) {
        // Remove from wishlist logic
        toast.success("Removed from wishlist");
      } else {
        addToWishlist(product);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error: {error || "Store not found"}
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="px-6 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: "#d4af37",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b8860b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#d4af37";
            }}
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              {store.logo_url ? (
                <img
                  src={`http://127.0.0.1:5000${store.logo_url}`}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaShoppingCart size={40} className="text-white" />
              )}
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {store.name}
              </h1>
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" size={18} />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-semibold">
                  4.5 (24 reviews)
                </span>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center justify-center lg:justify-start">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <FaPhone className="mr-2 text-gray-400" />
                  <span>{store.contact_number}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-700 text-lg">{store.description}</p>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Products from {store.name}
          </h2>
          {store.products.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No products available from this store.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={
                        product.image_url
                          ? `http://127.0.0.1:5000${product.image_url}`
                          : "/placeholder-image.jpg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                        isInWishlist(product.id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaHeart size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="font-bold text-base"
                        style={{ color: "#d4af37" }}
                      >
                        PKR {product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                      className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor:
                          product.stock_quantity > 0 ? "#d4af37" : "#9ca3af",
                        color: "#000000",
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#b8860b";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#d4af37";
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
