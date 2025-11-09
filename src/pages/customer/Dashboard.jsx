import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import SmartFooter from "../../components/footer/SmartFooter.jsx";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
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
    fetchWithAuth("http://localhost:5000/api/dashboard/customer")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setCartItems(data.cart_items || []);
        setWishlistItems(data.wishlist_items || []);
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
        setCartItems([]);
        setWishlistItems([]);
        setTotalSpent(0);
        setTotalOrders(0);
        setRecommendedProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Fixed Header */}
      <header
        className="shadow-lg px-6 py-4 flex-shrink-0"
        style={{
          backgroundColor: "#1d1d1d",
          borderBottom: "1px solid #2d2d2d",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-2xl font-bold">Naqsh Couture</h1>
            <span style={{ color: "#cccccc" }}>Customer Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "white", color: "#000000" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b8860b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d4af37";
              }}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "white", color: "#000000" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b8860b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d4af37";
              }}
            >
              Shop
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "#d4af37", color: "#000000" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b8860b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d4af37";
              }}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="px-4 py-2 rounded-lg transition-all hover:cursor-pointer"
              style={{ backgroundColor: "#dc3545", color: "#ffffff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c82333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Aside */}
        <aside
          className="w-64 shadow-lg flex-shrink-0 overflow-y-auto"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#2d2d2d" }}>
            <div className="flex items-center space-x-3">
              <img
                className="h-12 w-12 rounded-full object-cover border-2"
                style={{ borderColor: "#d4af37" }}
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
              <div>
                <p className="font-semibold" style={{ color: "#ffffff" }}>
                  {userData?.name || "Customer"}
                </p>
                <p className="text-sm" style={{ color: "#cccccc" }}>
                  {userData?.email}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            <div className="px-6">
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#d4af37" }}
              >
                Dashboard
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/customer-dashboard"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    📊 Overview
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    🛒 Cart ({cartItems.length})
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    ❤️ Wishlist ({wishlistItems.length})
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer/orders"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    📦 Orders ({totalOrders})
                  </Link>
                </li>
              </ul>

              <h3
                className="text-xs font-semibold uppercase tracking-wider mt-8 mb-3"
                style={{ color: "#d4af37" }}
              >
                Account
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    ⚙️ Profile Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    🛍️ Browse Collections
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* User Header */}
            <div
              className="shadow-lg rounded-2xl mb-8 p-8"
              style={{ backgroundColor: "#1d1d1d" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-20 w-20 rounded-full object-cover border-4 shadow-lg"
                      style={{ borderColor: "#d4af37" }}
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
                    <h2
                      className="text-4xl font-extrabold"
                      style={{ color: "#d4af37" }}
                    >
                      Welcome back, {userData?.name || "Customer"}! 👋
                    </h2>
                    <p className="mt-2" style={{ color: "#cccccc" }}>
                      {userData?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                  style={{ backgroundColor: "#d4af37", color: "#000000" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#b8860b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#d4af37";
                  }}
                >
                  ⚙️ Manage Profile
                </Link>
              </div>
            </div>

            <h1
              className="text-3xl font-extrabold mb-8"
              style={{ color: "#d4af37" }}
            >
              📊 Dashboard
            </h1>

            {/* Stats Grid - Clickable Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {/* Cart Items */}
              <div
                onClick={() => navigate("/cart")}
                className="shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer p-6 rounded-2xl"
                style={{
                  backgroundColor: "#1d1d1d",
                  border: "1px solid #2d2d2d",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#cccccc" }}
                    >
                      🛒 Cart Items
                    </p>
                    <p
                      className="text-4xl font-extrabold mt-2"
                      style={{ color: "#ffffff" }}
                    >
                      {cartItems.length}
                    </p>
                  </div>
                  <div className="text-4xl">🛍️</div>
                </div>
                <p className="text-xs mt-4" style={{ color: "#999999" }}>
                  Click to view cart
                </p>
              </div>

              {/* Wishlist Items */}
              <div
                onClick={() => navigate("/wishlist")}
                className="shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer p-6 rounded-2xl"
                style={{
                  backgroundColor: "#1d1d1d",
                  border: "1px solid #2d2d2d",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#cccccc" }}
                    >
                      ❤️ Wishlist
                    </p>
                    <p
                      className="text-4xl font-extrabold mt-2"
                      style={{ color: "#ffffff" }}
                    >
                      {wishlistItems.length}
                    </p>
                  </div>
                  <div className="text-4xl">💝</div>
                </div>
                <p className="text-xs mt-4" style={{ color: "#999999" }}>
                  Click to view wishlist
                </p>
              </div>

              {/* Total Orders */}
              <div
                onClick={() => navigate("/customer/orders")}
                className="shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer p-6 rounded-2xl"
                style={{
                  backgroundColor: "#1d1d1d",
                  border: "1px solid #2d2d2d",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#cccccc" }}
                    >
                      📦 Total Orders
                    </p>
                    <p
                      className="text-4xl font-extrabold mt-2"
                      style={{ color: "#ffffff" }}
                    >
                      {totalOrders}
                    </p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
                <p className="text-xs mt-4" style={{ color: "#999999" }}>
                  Click to view all orders
                </p>
              </div>

              {/* Total Spent */}
              <div
                className="shadow-md p-6 rounded-2xl"
                style={{
                  backgroundColor: "#1d1d1d",
                  border: "1px solid #2d2d2d",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#cccccc" }}
                    >
                      💰 Total Spent
                    </p>
                    <p
                      className="text-4xl font-extrabold mt-2"
                      style={{ color: "#ffffff" }}
                    >
                      PKR {totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-4xl">💳</div>
                </div>
                <p className="text-xs mt-4" style={{ color: "#999999" }}>
                  Lifetime spending
                </p>
              </div>
            </div>

            {recommendedProducts.length > 0 && (
              <div
                className="shadow-lg border mb-12 rounded-2xl"
                style={{ backgroundColor: "#1d1d1d", borderColor: "#2d2d2d" }}
              >
                <div className="px-8 py-6 sm:px-8">
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "#d4af37" }}
                  >
                    ✨ You Might Also Like
                  </h3>
                  <p className="mt-2" style={{ color: "#cccccc" }}>
                    Recommended products based on your preferences
                  </p>
                </div>
                <div className="px-8 py-6 sm:px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer p-4 rounded-xl"
                        style={{ backgroundColor: "#2d2d2d" }}
                      >
                        <div className="mb-4 overflow-hidden rounded-lg">
                          <img
                            src={
                              product.image_url || "/placeholder-product.jpg"
                            }
                            alt={product.name}
                            className="w-full h-40 object-cover hover:scale-110 transition-transform"
                          />
                        </div>
                        <h4
                          className="text-sm font-bold truncate"
                          style={{ color: "#ffffff" }}
                        >
                          {product.name}
                        </h4>
                        <p
                          className="text-xs truncate mt-1"
                          style={{ color: "#cccccc" }}
                        >
                          {product.store_name}
                        </p>
                        <p
                          className="text-lg font-bold mt-3"
                          style={{ color: "#d4af37" }}
                        >
                          PKR {product.price}
                        </p>
                        <button
                          className="mt-3 w-full py-2 px-4 rounded-lg text-sm font-bold transition-all transform hover:scale-105"
                          style={{
                            backgroundColor: "#d4af37",
                            color: "#000000",
                          }}
                        >
                          👁️ View Product
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders Section */}
            <div
              className="shadow-lg border rounded-2xl"
              style={{ backgroundColor: "#1d1d1d", borderColor: "#2d2d2d" }}
            >
              <div className="px-8 py-6 sm:px-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: "#d4af37" }}
                    >
                      📦 Recent Orders
                    </h3>
                    <p className="mt-2" style={{ color: "#cccccc" }}>
                      Your latest order history
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/customer/orders")}
                    className="px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105"
                    style={{ backgroundColor: "#d4af37", color: "#000000" }}
                  >
                    View All →
                  </button>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: "#2d2d2d" }}>
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/customer/orders/${order.id}`)}
                      className="px-8 py-6 hover:bg-gray-800/50 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-d4af37"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p
                              className="text-lg font-bold"
                              style={{ color: "#ffffff" }}
                            >
                              Order #{order.id}
                            </p>
                            <p
                              className="text-sm mt-1"
                              style={{ color: "#cccccc" }}
                            >
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
                          <p
                            className="text-2xl font-bold"
                            style={{ color: "#d4af37" }}
                          >
                            PKR {order.total_amount}
                          </p>
                          <span
                            className={`inline-block mt-2 px-4 py-1 text-sm font-bold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-900 text-green-200"
                                : order.status === "shipped"
                                ? "bg-blue-900 text-blue-200"
                                : order.status === "processing"
                                ? "bg-yellow-900 text-yellow-200"
                                : order.status === "cancelled"
                                ? "bg-red-900 text-red-200"
                                : "bg-gray-900 text-gray-200"
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
                    <p className="text-2xl" style={{ color: "#999999" }}>
                      🛒
                    </p>
                    <p className="mt-3" style={{ color: "#cccccc" }}>
                      No orders yet
                    </p>
                    <Link
                      to="/collections"
                      className="inline-block mt-4 px-6 py-2 rounded-lg font-bold transition-all"
                      style={{ backgroundColor: "#d4af37", color: "#000000" }}
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <SmartFooter variant="simple" />
    </div>
  );
};

export default CustomerDashboard;
