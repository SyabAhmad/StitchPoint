import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaShoppingCart,
  FaHeart,
  FaBoxOpen,
  FaUserCog,
  FaStore,
  FaHome,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import SmartFooter from "../../components/footer/SmartFooter.jsx";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
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

    fetchWithAuth("http://localhost:5000/api/dashboard/customer")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setCartItems(data.cart_items || []);
        setWishlistItems(data.wishlist_items || []);
        setTotalSpent(data.total_spent || 0);
        setTotalOrders(data.total_orders || 0);
        setRecommendedProducts(data.recommended_products || []);
        if (data.user?.profile_picture) {
          setProfilePicture(data.user.profile_picture);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mb-4"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  const userData = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    { to: "/customer-dashboard", icon: <FaTachometerAlt />, label: "Overview", exact: true },
    { to: "/customer-dashboard/cart", icon: <FaShoppingCart />, label: "Cart", badge: cartItems.length },
    { to: "/customer-dashboard/wishlist", icon: <FaHeart />, label: "Wishlist", badge: wishlistItems.length },
    { to: "/customer-dashboard/orders", icon: <FaBoxOpen />, label: "Orders", badge: totalOrders },
  ];

  const accountItems = [
    { to: "/customer-dashboard/profile", icon: <FaUserCog />, label: "Profile Settings" },
    { to: "/collections", icon: <FaStore />, label: "Browse Collections" },
  ];

  const isActive = (to, exact) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-gold-500"
            src={profilePicture || userData?.profile_picture || "/placeholder-avatar.svg"}
            alt="Profile"
            onError={(e) => { e.target.src = "/placeholder-avatar.svg"; }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{userData?.name || "Customer"}</p>
            <p className="text-sm text-gray-500 truncate">{userData?.email}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-2">Dashboard</h3>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-gold-500/10 text-gold-600 border-l-2 border-gold-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-8 mb-3 px-2">Account</h3>
        <ul className="space-y-1">
          {accountItems.map((item) => {
            const active = isActive(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-gold-500/10 text-gold-600 border-l-2 border-gold-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="flex items-center gap-0.5">
            <span className="text-gold-500 font-serif text-lg font-semibold">Naqsh</span>
            <span className="text-gray-900 font-serif text-lg font-light">Couture</span>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-600 text-[10px] font-semibold uppercase tracking-[0.15em]">
            <FaTachometerAlt className="text-[10px]" />
            Customer Panel
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaHome className="text-[11px]" />
            Home
          </Link>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaStore className="text-[11px]" />
            Shop
          </Link>

          <span className="hidden md:block w-px h-5 bg-gray-200" />

          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full border border-gray-200 hover:border-gold-500/50 transition-colors"
              title={userData?.name || "Customer"}
            >
              {profilePicture || userData?.profile_picture ? (
                <img
                  src={profilePicture || userData?.profile_picture}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                  onError={(e) => { e.target.src = "/placeholder-avatar.svg"; }}
                />
              ) : (
                <span className="w-7 h-7 rounded-full bg-gold-500 text-black text-[11px] font-bold flex items-center justify-center">
                  {userData?.name?.charAt(0)?.toUpperCase() || "C"}
                </span>
              )}
              <span className="hidden lg:block text-left">
                <span className="block text-[11px] text-gray-800 leading-tight max-w-28 truncate">
                  {userData?.name || "Customer"}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-gold-600 leading-tight">
                  Customer
                </span>
              </span>
              <FaChevronDown
                className={`text-[9px] text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userMenuOpen && (
              <div className="nc-dropdown absolute right-0 top-[calc(100%+10px)] w-60 bg-white border border-gray-200 rounded-lg shadow-xl shadow-black/10 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-[13px] text-gray-900 font-medium truncate">{userData?.name || "Customer"}</p>
                  <p className="text-[11px] text-gray-500 truncate">{userData?.email}</p>
                </div>
                <Link
                  to="/customer-dashboard"
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-gold-600 hover:bg-gray-50 transition-colors"
                >
                  <FaTachometerAlt className="text-xs" /> Overview
                </Link>
                <Link
                  to="/customer-dashboard/orders"
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-gold-600 hover:bg-gray-50 transition-colors"
                >
                  <FaBoxOpen className="text-xs" /> My Orders
                </Link>
                <Link
                  to="/customer-dashboard/profile"
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-gold-600 hover:bg-gray-50 transition-colors"
                >
                  <FaUserCog className="text-xs" /> Profile Settings
                </Link>
                <button
                  onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="text-xs" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-14 bottom-0 left-0 z-50 w-56 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}>
          <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 lg:hidden">
            <h2 className="font-semibold text-gray-900">Menu</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <FaTimes />
            </button>
          </div>
          <div className="overflow-y-auto h-full pb-4">{sidebarContent}</div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {location.pathname === "/customer-dashboard" && (
              <>
                {/* Welcome banner */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <img
                        className="h-20 w-20 rounded-full object-cover border-2 border-gold-500"
                        src={profilePicture || userData?.profile_picture || "/placeholder-avatar.svg"}
                        alt="Profile"
                        onError={(e) => { e.target.src = "/placeholder-avatar.svg"; }}
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Welcome back, {userData?.name || "Customer"}
                        </h2>
                        <p className="text-gray-500 mt-1">{userData?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/customer-dashboard/profile"
                      className="px-6 py-3 rounded-lg font-semibold text-sm bg-gold-500 text-black hover:bg-gold-600 transition-colors"
                    >
                      Manage Profile
                    </Link>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <button
                    onClick={() => navigate("/customer-dashboard/cart")}
                    className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gold-500 transition-colors"
                  >
                    <p className="text-sm text-gray-500">Cart Items</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{cartItems.length}</p>
                  </button>
                  <button
                    onClick={() => navigate("/customer-dashboard/wishlist")}
                    className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gold-500 transition-colors"
                  >
                    <p className="text-sm text-gray-500">Wishlist</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{wishlistItems.length}</p>
                  </button>
                  <button
                    onClick={() => navigate("/customer-dashboard/orders")}
                    className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gold-500 transition-colors"
                  >
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
                  </button>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">PKR {totalSpent.toFixed(2)}</p>
                  </div>
                </div>

                {/* Recommended products */}
                {recommendedProducts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">You Might Also Like</h3>
                    <p className="text-sm text-gray-500 mb-6">Recommended products based on your preferences</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {recommendedProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:border-gold-500 transition-colors cursor-pointer"
                        >
                          <img
                            src={product.image_url || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500 truncate mt-1">{product.store_name}</p>
                            <p className="text-lg font-bold text-gold-600 mt-2">PKR {product.price}</p>
                            <button className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors">
                              View Product
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-8 py-6 flex justify-between items-center border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                      <p className="text-sm text-gray-500 mt-1">Your latest order history</p>
                    </div>
                    <button
                      onClick={() => navigate("/customer-dashboard/orders")}
                      className="px-4 py-2 text-sm font-semibold text-gold-600 hover:bg-gold-500/10 rounded-lg transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {orders.length > 0 ? (
                      orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => navigate(`/customer-dashboard/orders/${order.id}`)}
                          className="px-8 py-5 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">PKR {order.total_amount}</p>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
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
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-8 py-12 text-center">
                        <p className="text-gray-500">No orders yet</p>
                        <Link
                          to="/collections"
                          className="inline-block mt-3 px-6 py-2 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Outlet />
          </div>
        </main>
      </div>

      <SmartFooter variant="simple" />
    </div>
  );
};

export default CustomerDashboard;
