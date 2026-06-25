import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { getWishlist, removeFromWishlist } from "../utils/wishlistUtils";
import { addToCart } from "../utils/cartUtils";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      await loadWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-black transition-colors">
              <FaArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold tracking-widest uppercase">
              My Wishlist
            </h1>
          </div>
          <span className="text-gray-600 font-medium tracking-widest uppercase">
            {wishlistItems.length} items
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 text-6xl mb-6">
              <FaHeart />
            </div>
            <h2 className="text-xl font-bold tracking-widest uppercase text-gray-800 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-8">Save items you love for later!</p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 border-2 border-black text-black font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/product/${item.id}`} className="block">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={
                        item.image_url
                          ? `http://127.0.0.1:5000${item.image_url}`
                          : "/placeholder-image.jpg"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 uppercase tracking-wide">
                      {item.name}
                    </h3>
                  </Link>

                  {item.store && (
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                      {item.store.name}
                    </p>
                  )}

                  <p className="text-lg font-bold text-gray-900 mb-4">
                    PKR {item.price}
                  </p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 py-3 border-2 border-black text-black font-bold tracking-widest uppercase text-xs hover:bg-black hover:text-white transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart size={14} />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="px-3 py-3 border-2 border-gray-300 text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;