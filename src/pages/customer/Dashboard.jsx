import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!token || !userData || userData.role !== "customer") {
      window.location.href = "/login";
      return;
    }

    // Fetch dashboard data
    fetch("http://localhost:5000/api/dashboard/customer", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setCartCount(data.cart_count || 0);
        setWishlistCount(data.wishlist_count || 0);
        setTotalSpent(data.total_spent || 0);
        setTotalOrders(data.total_orders || 0);
        setRecommendedProducts(data.recommended_products || []);
        // Update profile picture from dashboard data
        if (data.user?.profile_picture) {
          setProfilePicture(data.user.profile_picture);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setOrders([]);
        setCartCount(0);
        setWishlistCount(0);
        setTotalSpent(0);
        setTotalOrders(0);
        setRecommendedProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* User Header */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg rounded-2xl mb-8 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-20 w-20 rounded-full object-cover border-4 border-gray-900 shadow-lg"
                    src={
                      profilePicture ||
                      userData?.profile_picture ||
                      "/placeholder-avatar.svg"
                    }
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = "/placeholder-avatar.svg";
                    }}
                  />
                </div>
                <div className="ml-6 flex-1">
                  <h2 className="text-4xl font-extrabold text-gray-900">
                    Welcome back, {userData?.name || "Customer"}! 👋
                  </h2>
                  <p className="text-gray-600 mt-2">{userData?.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                ⚙️ Manage Profile
              </Link>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            📊 Dashboard
          </h1>

          {/* Stats Grid - Clickable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Cart Items */}
            <div
              onClick={() => navigate("/cart")}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-gray-900 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    🛒 Cart Items
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    {cartCount}
                  </p>
                </div>
                <div className="text-4xl">🛍️</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Click to view cart</p>
            </div>

            {/* Wishlist Items */}
            <div
              onClick={() => navigate("/wishlist")}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-gray-900 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    ❤️ Wishlist
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    {wishlistCount}
                  </p>
                </div>
                <div className="text-4xl">💝</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Click to view wishlist
              </p>
            </div>

            {/* Total Orders */}
            <div
              onClick={() => navigate("/customer/orders")}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-gray-900 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    📦 Total Orders
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    {totalOrders}
                  </p>
                </div>
                <div className="text-4xl">📋</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Click to view all orders
              </p>
            </div>

            {/* Total Spent */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-gray-900 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    💰 Total Spent
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl">💳</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Lifetime spending</p>
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 mb-12">
              <div className="px-8 py-6 sm:px-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  ✨ You Might Also Like
                </h3>
                <p className="mt-2 text-gray-600">
                  Recommended products based on your preferences
                </p>
              </div>
              <div className="px-8 py-6 sm:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-gray-50 rounded-xl p-4 hover:shadow-xl hover:border-2 hover:border-gray-900 transition-all transform hover:scale-105 cursor-pointer border border-gray-200"
                    >
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                          src={product.image_url || "/placeholder-product.jpg"}
                          alt={product.name}
                          className="w-full h-40 object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {product.store_name}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-3">
                        ${product.price}
                      </p>
                      <button className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all transform hover:scale-105">
                        👁️ View Product
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders Section */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200">
            <div className="px-8 py-6 sm:px-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    📦 Recent Orders
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Your latest order history
                  </p>
                </div>
                <button
                  onClick={() => navigate("/customer/orders")}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/customer/orders/${order.id}`)}
                    className="px-8 py-6 hover:bg-gray-50 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-gray-900"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            📅{" "}
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${order.total_amount}
                        </p>
                        <span
                          className={`inline-block mt-2 px-4 py-1 text-sm font-bold rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-12 text-center">
                  <p className="text-2xl text-gray-400">🛒</p>
                  <p className="text-gray-600 mt-3">No orders yet</p>
                  <Link
                    to="/collections"
                    className="inline-block mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-2 rounded-lg transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
