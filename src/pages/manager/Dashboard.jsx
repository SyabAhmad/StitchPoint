import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaStore,
  FaUserCog,
  FaComment,
  FaStar,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import CostChart from "../../components/analytics/CostChart.jsx";
import SalesChart from "../../components/analytics/SalesChart.jsx";
import ProfitChart from "../../components/analytics/ProfitChart.jsx";
import SmartFooter from "../../components/footer/SmartFooter.jsx";

const ManagerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [financialTrends, setFinancialTrends] = useState([]);
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = JSON.parse(localStorage.getItem("user"));

    if (!token || !storedUserData || storedUserData.role !== "manager") {
      window.location.href = "/login";
      return;
    }

    setUserData(storedUserData);
    
    // Fetch store to get store logo
    const fetchStore = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/dashboard/store", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.store?.logo_url) {
            setProfilePicture(data.store.logo_url);
          }
        }
      } catch (err) {
        console.error("Error fetching store:", err);
      }
    };
    
    fetchStore();

    // Fetch dashboard data only if on the main dashboard route
    if (location.pathname === "/manager-dashboard") {
      Promise.all([
        fetchWithAuth("http://localhost:5000/api/dashboard/admin"),
        fetchWithAuth("http://localhost:5000/api/analytics/financial-trends"),
      ])
        .then(([dashboardResponse, trendsResponse]) => {
          if (!dashboardResponse.ok) {
            throw new Error(
              `Dashboard HTTP error! status: ${dashboardResponse.status}`
            );
          }
          if (!trendsResponse.ok) {
            throw new Error(
              `Trends HTTP error! status: ${trendsResponse.status}`
            );
          }
          return Promise.all([dashboardResponse.json(), trendsResponse.json()]);
        })
        .then(([dashboardData, trendsData]) => {
          setAnalytics(dashboardData.analytics || {});
          setRecentOrders(dashboardData.recent_orders || []);
          setFinancialTrends(trendsData.financial_trends || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
          setAnalytics({});
          setRecentOrders([]);
          setFinancialTrends([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  const handleMenuItemClick = () => {
    // No-op - kept for potential future mobile menu
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Elegant Header */}
      <header
        className="shadow-lg px-8 py-4 flex-shrink-0 ml-64 relative z-60"
        style={{
          backgroundColor: "#0a0a0a",
          borderBottom: "2px solid #d4af37",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 
              className="text-2xl font-bold tracking-[0.3em]" 
              style={{ 
                fontFamily: '"Playfair Display", serif',
                color: "#d4af37",
                textShadow: "0 0 20px rgba(212, 175, 55, 0.3)"
              }}
            >
              NAQSH
            </h1>
            <div 
              className="h-6 w-px" 
              style={{ backgroundColor: "#333333" }}
            />
            <span 
              className="text-sm font-medium uppercase tracking-widest" 
              style={{ color: "#666666", letterSpacing: "0.2em" }}
            >
              Manager
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="px-5 py-2 rounded-md transition-all text-sm font-medium tracking-wide"
              style={{ 
                color: "#888888",
                border: "1px solid #333333",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d4af37";
                e.currentTarget.style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333333";
                e.currentTarget.style.color = "#888888";
              }}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="px-5 py-2 rounded-md transition-all text-sm font-medium tracking-wide"
              style={{ 
                color: "#888888",
                border: "1px solid #333333",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d4af37";
                e.currentTarget.style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333333";
                e.currentTarget.style.color = "#888888";
              }}
            >
              Shop
            </Link>
            <Link
              to="/manager-dashboard/profile"
              className="px-5 py-2 rounded-md transition-all text-sm font-medium tracking-wide"
              style={{ 
                color: "#888888",
                border: "1px solid #333333",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d4af37";
                e.currentTarget.style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333333";
                e.currentTarget.style.color = "#888888";
              }}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="px-5 py-2 rounded-md transition-all text-sm font-medium tracking-wide hover:cursor-pointer"
              style={{ 
                color: "#ffffff",
                backgroundColor: "#d4af37",
                border: "1px solid #d4af37"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b8962f";
                e.currentTarget.style.borderColor = "#b8962f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d4af37";
                e.currentTarget.style.borderColor = "#d4af37";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Sidebar - Always visible */}
        <aside
          className="fixed inset-y-0 left-0 z-50 w-64 shadow-lg"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#2d2d2d" }}>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "#2d2d2d", border: "2px solid #d4af37" }}
              >
                {profilePicture ? (
                  <img 
                    src={profilePicture.startsWith('http') ? profilePicture : `http://localhost:5000${profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <FaUser className="text-xl" style={{ color: "#d4af37" }} />
                )}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#ffffff" }}>
                  {userData?.name || "Manager"}
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
                style={{ color: "#ffffff" }}
              >
                Management
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/manager-dashboard"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/manager-dashboard") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/manager-dashboard") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaUsers className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/products"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/products"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/products"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/products"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/manager-dashboard/products") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/manager-dashboard/products") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaBox className="mr-3 h-5 w-5" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/orders"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/orders"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/orders"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/orders"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/manager-dashboard/orders") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/manager-dashboard/orders") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/categories"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/categories"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/categories"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/categories"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/manager-dashboard/categories"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/manager-dashboard/categories"
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaStore className="mr-3 h-5 w-5" />
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/analytics"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/analytics"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/analytics"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/analytics"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/manager-dashboard/analytics"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/manager-dashboard/analytics"
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaChartLine className="mr-3 h-5 w-5" />
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/comments"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/comments"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/comments"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/comments"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/manager-dashboard/comments") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/manager-dashboard/comments") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaComment className="mr-3 h-5 w-5" />
                    Comments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/reviews"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/reviews"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/reviews"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/reviews"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/manager-dashboard/reviews") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/manager-dashboard/reviews") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaStar className="mr-3 h-5 w-5" />
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/profile"
                    onClick={handleMenuItemClick}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/manager-dashboard/profile"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/manager-dashboard/profile"
                          ? "#ffffff"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/manager-dashboard/profile"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/manager-dashboard/profile") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/manager-dashboard/profile") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaUserCog className="mr-3 h-5 w-5" />
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content - starts after sidebar */}
        <main className="flex-1 p-8 overflow-y-auto ml-64">
          <div className="max-w-7xl mx-auto">
            {location.pathname === "/manager-dashboard" && (
              <>
                <h1
                  className="text-3xl font-bold mb-6"
                  style={{ color: "#ffffff" }}
                >
                  Manager Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">P</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Total Products
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {analytics.total_products || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">O</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Total Orders
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {analytics.total_orders || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">C</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Cart Items
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {analytics.total_cart_items || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">W</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Wishlist Items
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {analytics.total_wishlist_items || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">U</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Total Units Sold
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {analytics.total_units_sold || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <FaMoneyBillWave size={16} />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Total Costs
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            PKR{" "}
                            {analytics.total_costs
                              ? analytics.total_costs.toFixed(2)
                              : "0.00"}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-5"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">P</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Total Profit
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            PKR{" "}
                            {analytics.total_profit
                              ? analytics.total_profit.toFixed(2)
                              : "0.00"}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Trends Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <CostChart data={financialTrends} />
                  <SalesChart data={financialTrends} />
                  <ProfitChart data={financialTrends} />
                </div>

                {/* Top Rated Products Card */}
                <div className="mb-8">
                  <div
                    className="shadow rounded-lg p-6"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <h3
                      className="text-lg leading-6 font-medium mb-4"
                      style={{ color: "#ffffff" }}
                    >
                      Top Rated Products
                    </h3>
                    <div className="space-y-3">
                      {analytics.top_rated_products &&
                      analytics.top_rated_products.length > 0 ? (
                        analytics.top_rated_products
                          .slice(0, 5)
                          .map((product, index) => (
                            <div
                              key={product.product_id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3"
                                  style={{
                                    backgroundColor: "#ffffff",
                                    color: "#000000",
                                  }}
                                >
                                  {index + 1}
                                </span>
                                <span
                                  style={{ color: "#cccccc" }}
                                  className="truncate"
                                >
                                  {product.product_name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-semibold"
                                  style={{
                                    backgroundColor: "#2d2d2d",
                                    color: "#ffffff",
                                  }}
                                >
                                  {product.avg_rating} ⭐
                                </span>
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-semibold"
                                  style={{
                                    backgroundColor: "#2d2d2d",
                                    color: "#cccccc",
                                  }}
                                >
                                  {product.review_count} reviews
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p style={{ color: "#999999" }} className="text-sm">
                          No review data available
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="shadow overflow-hidden sm:rounded-md"
                  style={{ backgroundColor: "#1d1d1d" }}
                >
                  <div
                    className="px-4 py-5 sm:px-6 border-b"
                    style={{ borderColor: "#2d2d2d" }}
                  >
                    <h3
                      className="text-lg leading-6 font-medium"
                      style={{ color: "#ffffff" }}
                    >
                      Recent Orders
                    </h3>
                    <p
                      className="mt-1 max-w-2xl text-sm"
                      style={{ color: "#999999" }}
                    >
                      Latest orders from customers
                    </p>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <li 
                          key={order.id} 
                          onClick={() => navigate(`/manager-dashboard/orders?order=${order.id}`)}
                          className="cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p
                                  className="text-sm font-medium truncate"
                                  style={{ color: "#ffffff" }}
                                >
                                  Order #{order.id}
                                </p>
                                <p className="ml-2 flex-shrink-0 flex">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      order.status === "delivered"
                                        ? "bg-green-900 text-green-200"
                                        : order.status === "shipped"
                                        ? "bg-blue-900 text-blue-200"
                                        : order.status === "processing"
                                        ? "bg-gray-900 text-gray-200"
                                        : "bg-gray-900 text-gray-200"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p
                                  className="text-sm"
                                  style={{ color: "#cccccc" }}
                                >
                                  PKR {order.total_amount}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p
                                  className="flex items-center text-sm"
                                  style={{ color: "#999999" }}
                                >
                                  By {order.user_email} •{" "}
                                  {new Date(
                                    order.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>
                        <div className="px-4 py-4 sm:px-6">
                          <p className="text-sm" style={{ color: "#999999" }}>
                            No recent orders
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
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

export default ManagerDashboard;
