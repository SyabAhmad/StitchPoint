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
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";

const ManagerDashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!token || !userData || userData.role !== "manager") {
      window.location.href = "/login";
      return;
    }

    // Fetch dashboard data only if on the main dashboard route
    if (location.pathname === "/manager-dashboard") {
      fetch("http://localhost:5000/api/dashboard/admin", {
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
          setAnalytics(data.analytics || {});
          setRecentOrders(data.recent_orders || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
          setAnalytics({});
          setRecentOrders([]);
          setLoading(false);
        });
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
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-64 shadow-lg min-h-screen"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#2d2d2d" }}>
            <h2 className="text-xl font-bold" style={{ color: "#d4af37" }}>
              Manager Panel
            </h2>
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
                    to="/manager-dashboard"
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
                    <FaUsers className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/products"
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
                    <FaBox className="mr-3 h-5 w-5" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/orders"
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
                    <FaShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/categories"
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
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/analytics"
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
                    <FaChartLine className="mr-3 h-5 w-5" />
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manager-dashboard/profile"
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
                    <FaUserCog className="mr-3 h-5 w-5" />
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {location.pathname === "/manager-dashboard" && (
              <>
                <h1
                  className="text-3xl font-bold mb-6"
                  style={{ color: "#d4af37" }}
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
                            backgroundColor: "#d4af37",
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
                            {analytics.total_products}
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
                            backgroundColor: "#d4af37",
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
                            {analytics.total_orders}
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
                            backgroundColor: "#d4af37",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">V</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Page Views Today
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {analytics.page_views_today}
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
                            backgroundColor: "#d4af37",
                            color: "#000000",
                          }}
                        >
                          <span className="font-bold">R</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            className="text-sm font-medium truncate"
                            style={{ color: "#cccccc" }}
                          >
                            Revenue Today
                          </dt>
                          <dd
                            className="text-lg font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            ${analytics.revenue_today || 0}
                          </dd>
                        </dl>
                      </div>
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
                        <li key={order.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p
                                  className="text-sm font-medium truncate"
                                  style={{ color: "#d4af37" }}
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
                                        ? "bg-yellow-900 text-yellow-200"
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
                                  ${order.total_amount}
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
    </div>
  );
};

export default ManagerDashboard;
