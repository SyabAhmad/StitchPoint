import React, { useState, useEffect } from "react";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import {
  getWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../utils/wishlistUtils";
import { addToCart } from "../utils/cartUtils";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const items = getWishlist();
    setWishlistItems(items);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    loadWishlist();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
    // loadWishlist();
    alert("Added to cart!");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            <FaHeart />
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500">Save items you love for later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-gray-600">{wishlistItems.length} items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={
                  item.image_url
                    ? `http://127.0.0.1:5000${item.image_url}`
                    : "/placeholder-image.jpg"
                }
                alt={item.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
              >
                <FaTrash className="text-red-500" size={16} />
              </button>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.name}
              </h3>

              {item.store && (
                <p className="text-sm text-gray-600 mb-2">
                  From {item.store.name}
                </p>
              )}

              <p className="text-xl font-bold text-gray-900 mb-4">
                ${item.price}
              </p>

              <button
                onClick={() => handleAddToCart(item)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
