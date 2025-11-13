import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartTotal,
  clearCart,
} from "../utils/cartUtils";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setUpdating] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await getCart();
      setCartItems(items);
      const cartTotal = await getCartTotal();
      setTotal(cartTotal);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true);
      await removeFromCart(productId);
      await loadCart();
    } catch (error) {
      console.error("Error removing item:", error);
      // Could show error toast here
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdating(true);
      await updateCartItemQuantity(productId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Could show error toast here
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setUpdating(true);
      await clearCart();
      await loadCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Could show error toast here
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Add some awesome products to get started!
            </p>
            <a
              href="/collections"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              🛍️ Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              🛒 Shopping Cart
            </h1>
            <p className="text-gray-600 mt-2">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in
              your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            🗑️ Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl p-6 transition-all"
              >
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        item.image_url
                          ? `http://127.0.0.1:5000${item.image_url}`
                          : "/placeholder-image.jpg"
                      }
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">
                      {item.name}
                    </h3>
                    {item.store && (
                      <p className="text-sm text-gray-500 mt-1">
                        From{" "}
                        <span className="font-semibold text-gray-700">
                          {item.store.name}
                        </span>
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      PKR {item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="bg-white hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all"
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="bg-white hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      PKR {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg mt-2 transition-all"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-lg p-8 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📋 Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">PKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Items</span>
                  <span className="font-semibold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>🚚 Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>💰 Tax (8%)</span>
                  <span className="font-semibold">
                    PKR {(total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <hr className="my-6 border-gray-300" />

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-gray-900">
                  PKR {(total * 1.08).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                ✓ Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 mt-6 text-center">
                🔒 Secure checkout powered by SSL encryption
              </p>

              <a
                href="/collections"
                className="block mt-4 text-center text-gray-600 hover:text-gray-900 font-semibold transition-colors"
              >
                ← Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
