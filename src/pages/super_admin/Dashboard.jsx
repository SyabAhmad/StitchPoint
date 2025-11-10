import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaEye,
  FaMousePointer,
  FaChartLine,
  FaCog,
  FaStore,
  FaUserCog,
  FaChartBar,
  FaStoreAlt,
  FaComments,
  FaStar,
  FaPlus,
  FaList,
  FaClipboardList,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import CostChart from "../../components/analytics/CostChart.jsx";
import SalesChart from "../../components/analytics/SalesChart.jsx";
import ProfitChart from "../../components/analytics/ProfitChart.jsx";
import CommissionChart from "../../components/analytics/CommissionChart.jsx";
import NotificationCenter from "../../components/NotificationCenter.jsx";
import RevenueChart from "../../components/analytics/RevenueChart.jsx";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart.jsx";
import SmartFooter from "../../components/footer/SmartFooter.jsx";

const SuperAdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [financialTrends, setFinancialTrends] = useState([]);
  const [commissionData, setCommissionData] = useState({});
  const [commissionTrends, setCommissionTrends] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (
      !token ||
      !userData ||
      !["manager", "super_admin"].includes(userData.role)
    ) {
      window.location.href = "/login";
      return;
    }

    // Fetch dashboard data only if on the main dashboard route
    if (location.pathname === "/super-admin-dashboard") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUserData(userData);

      // Fetch different data based on user role
      if (userData && userData.role === "super_admin") {
        Promise.all([
          fetchWithAuth("http://localhost:5000/api/dashboard/admin"),
          fetchWithAuth("http://localhost:5000/api/analytics/financial-trends"),
          fetchWithAuth("http://localhost:5000/api/dashboard/commissions"),
          fetchWithAuth(
            "http://localhost:5000/api/dashboard/commission-trends"
          ),
        ])
          .then(
            ([
              dashboardResponse,
              trendsResponse,
              commissionResponse,
              commissionTrendsResponse,
            ]) => {
              const responses = [
                dashboardResponse,
                trendsResponse,
                commissionResponse,
                commissionTrendsResponse,
              ];
              const errors = responses.filter((response) => !response.ok);

              if (errors.length > 0) {
                throw new Error(
                  `HTTP errors: ${errors.map((e) => e.status).join(", ")}`
                );
              }

              return Promise.all([
                dashboardResponse.json(),
                trendsResponse.json(),
                commissionResponse.json(),
                commissionTrendsResponse.json(),
              ]);
            }
          )
          .then(
            ([
              dashboardData,
              trendsData,
              commissionResponse,
              commissionTrendsData,
            ]) => {
              setAnalytics(dashboardData.analytics || {});
              setRecentOrders(dashboardData.recent_orders || []);
              setFinancialTrends(trendsData.financial_trends || []);
              setCommissionData(commissionResponse || {});
              setCommissionTrends(commissionTrendsData.commission_trends || []);
              setLoading(false);
            }
          )
          .catch((error) => {
            console.error("Error fetching dashboard data:", error);
            setAnalytics({});
            setRecentOrders([]);
            setFinancialTrends([]);
            setCommissionData({});
            setCommissionTrends([]);
            setLoading(false);
          });
      } else {
        // Regular dashboard for managers
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
            return Promise.all([
              dashboardResponse.json(),
              trendsResponse.json(),
            ]);
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
      }
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

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

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Fixed Header */}
      <header
        className="shadow-lg px-6 py-4 flex-shrink-0 relative z-60"
        style={{
          backgroundColor: "#1d1d1d",
          borderBottom: "1px solid #2d2d2d",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#2d2d2d", color: "#ffffff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#d4af37";
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2d2d2d";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-white text-2xl font-bold">Naqsh Couture</h1>
            <span style={{ color: "#cccccc" }}>Super Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "#d4af37", color: "#000000" }}
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
              to="/shope"
              className="px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "#d4af37", color: "#000000" }}
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
              to="/super-admin-dashboard/user-management"
              className="px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "#d4af37", color: "#000000" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b8860b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d4af37";
              }}
            >
              Settings
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Aside */}
        <aside
          className={`w-64 shadow-lg overflow-y-auto md:block md:relative md:flex-shrink-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:z-auto`}
          style={{ backgroundColor: "#1d1d1d" }}
        >
          {/* Mobile Header */}
          <div
            className="flex items-center justify-between p-6 border-b md:hidden"
            style={{ borderColor: "#2d2d2d" }}
          >
            <h2 className="text-lg font-semibold" style={{ color: "#ffffff" }}>
              Menu
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#2d2d2d", color: "#ffffff" }}
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-6 border-b" style={{ borderColor: "#2d2d2d" }}>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#d4af37" }}
              >
                <span className="text-black font-bold text-lg">
                  {userData?.name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#ffffff" }}>
                  {userData?.name || "Super Admin"}
                </p>
                <p className="text-sm" style={{ color: "#cccccc" }}>
                  {userData?.email}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            <div className="px-6 py-2">
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#d4af37" }}
              >
                Management
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link
                    to="/super-admin-dashboard"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/super-admin-dashboard"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/super-admin-dashboard"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/super-admin-dashboard"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/super-admin-dashboard") {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/super-admin-dashboard") {
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
                    to="/super-admin-dashboard/analytics"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/super-admin-dashboard/analytics"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/super-admin-dashboard/analytics"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/super-admin-dashboard/analytics"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/analytics"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/analytics"
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
                    to="/super-admin-dashboard/user-management"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname ===
                      "/super-admin-dashboard/user-management"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname ===
                        "/super-admin-dashboard/user-management"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname ===
                        "/super-admin-dashboard/user-management"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !==
                        "/super-admin-dashboard/user-management"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !==
                        "/super-admin-dashboard/user-management"
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaUserCog className="mr-3 h-5 w-5" />
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/products"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/super-admin-dashboard/products"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/super-admin-dashboard/products"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/super-admin-dashboard/products"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/products"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/products"
                      ) {
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
                    to="/super-admin-dashboard/orders"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/super-admin-dashboard/orders"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/super-admin-dashboard/orders"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/super-admin-dashboard/orders"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/orders"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/orders"
                      ) {
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
                    to="/super-admin-dashboard/product-analytics"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname ===
                      "/super-admin-dashboard/product-analytics"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname ===
                        "/super-admin-dashboard/product-analytics"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname ===
                        "/super-admin-dashboard/product-analytics"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !==
                        "/super-admin-dashboard/product-analytics"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !==
                        "/super-admin-dashboard/product-analytics"
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaChartBar className="mr-3 h-5 w-5" />
                    Product Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/store-analytics"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname.startsWith(
                        "/super-admin-dashboard/store-analytics"
                      )
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color: location.pathname.startsWith(
                        "/super-admin-dashboard/store-analytics"
                      )
                        ? "#d4af37"
                        : "#ffffff",
                      backgroundColor: location.pathname.startsWith(
                        "/super-admin-dashboard/store-analytics"
                      )
                        ? "#2d2d2d"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !location.pathname.startsWith(
                          "/super-admin-dashboard/store-analytics"
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        !location.pathname.startsWith(
                          "/super-admin-dashboard/store-analytics"
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaStoreAlt className="mr-3 h-5 w-5" />
                    Store Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/comments"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname === "/super-admin-dashboard/comments"
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color:
                        location.pathname === "/super-admin-dashboard/comments"
                          ? "#d4af37"
                          : "#ffffff",
                      backgroundColor:
                        location.pathname === "/super-admin-dashboard/comments"
                          ? "#2d2d2d"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/comments"
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/super-admin-dashboard/comments"
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaComments className="mr-3 h-5 w-5" />
                    Comments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/reviews"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      location.pathname.startsWith(
                        "/super-admin-dashboard/reviews"
                      )
                        ? "active-menu-item"
                        : ""
                    }`}
                    style={{
                      color: location.pathname.startsWith(
                        "/super-admin-dashboard/reviews"
                      )
                        ? "#d4af37"
                        : "#ffffff",
                      backgroundColor: location.pathname.startsWith(
                        "/super-admin-dashboard/reviews"
                      )
                        ? "#2d2d2d"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !location.pathname.startsWith(
                          "/super-admin-dashboard/reviews"
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                        e.currentTarget.style.color = "#d4af37";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        !location.pathname.startsWith(
                          "/super-admin-dashboard/reviews"
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                  >
                    <FaStar className="mr-3 h-5 w-5" />
                    Reviews
                  </Link>
                </li>
                {userData && userData.role === "super_admin" && (
                  <>
                    <li>
                      <Link
                        to="/super-admin-dashboard/commissions"
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          location.pathname ===
                          "/super-admin-dashboard/commissions"
                            ? "active-menu-item"
                            : ""
                        }`}
                        style={{
                          color:
                            location.pathname ===
                            "/super-admin-dashboard/commissions"
                              ? "#d4af37"
                              : "#ffffff",
                          backgroundColor:
                            location.pathname ===
                            "/super-admin-dashboard/commissions"
                              ? "#2d2d2d"
                              : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (
                            location.pathname !==
                            "/super-admin-dashboard/commissions"
                          ) {
                            e.currentTarget.style.backgroundColor = "#2d2d2d";
                            e.currentTarget.style.color = "#d4af37";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (
                            location.pathname !==
                            "/super-admin-dashboard/commissions"
                          ) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#ffffff";
                          }
                        }}
                      >
                        <FaMoneyBillWave className="mr-3 h-5 w-5" />
                        Commissions
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/super-admin-dashboard/commission-rates"
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          location.pathname ===
                          "/super-admin-dashboard/commission-rates"
                            ? "active-menu-item"
                            : ""
                        }`}
                        style={{
                          color:
                            location.pathname ===
                            "/super-admin-dashboard/commission-rates"
                              ? "#d4af37"
                              : "#ffffff",
                          backgroundColor:
                            location.pathname ===
                            "/super-admin-dashboard/commission-rates"
                              ? "#2d2d2d"
                              : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (
                            location.pathname !==
                            "/super-admin-dashboard/commission-rates"
                          ) {
                            e.currentTarget.style.backgroundColor = "#2d2d2d";
                            e.currentTarget.style.color = "#d4af37";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (
                            location.pathname !==
                            "/super-admin-dashboard/commission-rates"
                          ) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#ffffff";
                          }
                        }}
                      >
                        <FaChartLine className="mr-3 h-5 w-5" />
                        Commission Rates
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="px-6 py-2">
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#d4af37" }}
              >
                Settings
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
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
                    <FaStore className="mr-3 h-5 w-5" />
                    Store Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
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
                    <FaCog className="mr-3 h-5 w-5" />
                    System Config
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {location.pathname === "/super-admin-dashboard" ? (
              <>
                {/* Financial Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div
                    className="shadow rounded-lg p-6"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <FaShoppingCart
                        className="h-8 w-8"
                        style={{ color: "#d4af37" }}
                      />
                      <div className="ml-4">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#cccccc" }}
                        >
                          Total Units Sold
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "#ffffff" }}
                        >
                          {analytics.total_units_sold || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="shadow rounded-lg p-6"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <FaMoneyBillWave
                        className="h-8 w-8"
                        style={{ color: "#ef4444" }}
                      />
                      <div className="ml-4">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#cccccc" }}
                        >
                          Total Costs
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "#ffffff" }}
                        >
                          PKR {analytics.total_costs?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="shadow rounded-lg p-6"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div className="flex items-center">
                      <FaChartLine
                        className="h-8 w-8"
                        style={{ color: "#10b981" }}
                      />
                      <div className="ml-4">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#cccccc" }}
                        >
                          Total Profit
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "#ffffff" }}
                        >
                          PKR {analytics.total_profit?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Commission Revenue Card - Only for Super Admin */}
                  {userData && userData.role === "super_admin" && (
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <div className="flex items-center">
                        <FaMoneyBillWave
                          className="h-8 w-8"
                          style={{ color: "#4ecdc4" }}
                        />
                        <div className="ml-4">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#cccccc" }}
                          >
                            Commission Revenue
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: "#ffffff" }}
                          >
                            PKR{" "}
                            {analytics.total_commission_revenue?.toLocaleString() ||
                              0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Charts */}
                {userData && userData.role === "super_admin" ? (
                  /* Super Admin Charts with Commission Data */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Sales & Profit Trends
                      </h3>
                      <SalesChart data={financialTrends} />
                    </div>
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Commission Earnings
                      </h3>
                      <CommissionChart data={commissionTrends} />
                    </div>
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Cost Analysis
                      </h3>
                      <CostChart data={financialTrends} />
                    </div>
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Revenue Performance
                      </h3>
                      <RevenueChart data={financialTrends} />
                    </div>
                  </div>
                ) : (
                  /* Manager Charts - Standard Financial Dashboard */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Sales Trends
                      </h3>
                      <SalesChart data={financialTrends} />
                    </div>
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Cost Trends
                      </h3>
                      <CostChart data={financialTrends} />
                    </div>
                    <div
                      className="shadow rounded-lg p-6"
                      style={{ backgroundColor: "#1d1d1d" }}
                    >
                      <h3
                        className="text-lg font-medium mb-4"
                        style={{ color: "#ffffff" }}
                      >
                        Profit Trends
                      </h3>
                      <ProfitChart data={financialTrends} />
                    </div>
                  </div>
                )}

                {/* Commission Analytics Section - Only for Super Admin */}
                {userData &&
                  userData.role === "super_admin" &&
                  commissionData && (
                    <div className="mb-8">
                      <h2
                        className="text-2xl font-bold mb-6"
                        style={{ color: "#d4af37" }}
                      >
                        Commission Analytics
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div
                          className="shadow rounded-lg p-6"
                          style={{ backgroundColor: "#1d1d1d" }}
                        >
                          <h3
                            className="text-lg font-medium mb-4"
                            style={{ color: "#ffffff" }}
                          >
                            Store Performance
                          </h3>
                          <div className="space-y-4">
                            {commissionData.store_breakdown &&
                              commissionData.store_breakdown
                                .slice(0, 5)
                                .map((store, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-3 rounded"
                                    style={{ backgroundColor: "#2d2d2d" }}
                                  >
                                    <div>
                                      <p
                                        className="font-medium"
                                        style={{ color: "#ffffff" }}
                                      >
                                        {store.store_name}
                                      </p>
                                      <p
                                        className="text-sm"
                                        style={{ color: "#cccccc" }}
                                      >
                                        {store.total_products} Products •{" "}
                                        {store.total_units_sold} Units Sold
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p
                                        className="font-bold"
                                        style={{ color: "#4ecdc4" }}
                                      >
                                        PKR{" "}
                                        {store.total_revenue.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                          </div>
                        </div>

                        <div
                          className="shadow rounded-lg p-6"
                          style={{ backgroundColor: "#1d1d1d" }}
                        >
                          <h3
                            className="text-lg font-medium mb-4"
                            style={{ color: "#ffffff" }}
                          >
                            Top Commission Earners
                          </h3>
                          <div className="space-y-4">
                            {commissionData.commission_summary &&
                              commissionData.commission_summary
                                .slice(0, 5)
                                .map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-3 rounded"
                                    style={{ backgroundColor: "#2d2d2d" }}
                                  >
                                    <div>
                                      <p
                                        className="font-medium"
                                        style={{ color: "#ffffff" }}
                                      >
                                        {item.product_name}
                                      </p>
                                      <p
                                        className="text-sm"
                                        style={{ color: "#cccccc" }}
                                      >
                                        {item.store_name} •{" "}
                                        {item.commission_type === "percentage"
                                          ? `${item.commission_value}%`
                                          : `PKR ${item.commission_value}`}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p
                                        className="font-bold"
                                        style={{ color: "#d4af37" }}
                                      >
                                        PKR{" "}
                                        {item.commission_earned.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Recent Orders */}
                <div
                  className="shadow overflow-hidden sm:rounded-md"
                  style={{ backgroundColor: "#1d1d1d" }}
                >
                  <div
                    className="px-4 py-5 sm:px-6 border-b"
                    style={{ borderColor: "#2d2d2d" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
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
                      <button
                        className="px-3 py-1 rounded-md text-sm transition-colors duration-200"
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
                        View All
                      </button>
                    </div>
                  </div>
                  <ul className="divide-y" style={{ borderColor: "#2d2d2d" }}>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <li
                          key={order.id}
                          className="transition-colors duration-150"
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1f1f1f";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                          }}
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p
                                  className="text-sm font-medium truncate mr-2 transition-colors duration-200"
                                  style={{ color: "#d4af37" }}
                                >
                                  Order #{order.id}
                                </p>
                                <p className="flex-shrink-0 flex">
                                  <span
                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                    style={{
                                      backgroundColor:
                                        order.status === "delivered"
                                          ? "rgba(72, 187, 120, 0.2)"
                                          : order.status === "shipped"
                                          ? "rgba(66, 153, 225, 0.2)"
                                          : order.status === "processing"
                                          ? "rgba(237, 137, 54, 0.2)"
                                          : "rgba(160, 174, 192, 0.2)",
                                      color:
                                        order.status === "delivered"
                                          ? "#48bb78"
                                          : order.status === "shipped"
                                          ? "#4299e1"
                                          : order.status === "processing"
                                          ? "#ed8936"
                                          : "#a0aec0",
                                    }}
                                  >
                                    {order.status}
                                  </span>
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "#ffffff" }}
                                >
                                  PKR {order.total_amount}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p
                                  className="flex items-center text-sm"
                                  style={{ color: "#cccccc" }}
                                >
                                  By{" "}
                                  <span
                                    className="font-medium ml-1"
                                    style={{ color: "#ffffff" }}
                                  >
                                    {order.user_email}
                                  </span>{" "}
                                  •{" "}
                                  <span className="ml-1 flex items-center">
                                    <FaCalendarAlt
                                      className="mr-1"
                                      style={{ color: "#d4af37" }}
                                    />
                                    {new Date(
                                      order.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>
                        <div className="px-4 py-8 sm:px-6 text-center">
                          <p className="text-sm" style={{ color: "#999999" }}>
                            No recent orders
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      <SmartFooter variant="simple" />
    </div>
  );
};

export default SuperAdminDashboard;
