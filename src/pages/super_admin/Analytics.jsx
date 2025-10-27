import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaEye,
  FaMousePointer,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  useEffect(() => {
    const token = localStorage.getItem("token");

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
        console.error("Error fetching analytics data:", error);
        setAnalytics({});
        setRecentOrders([]);
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
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return {
          backgroundColor: "rgba(72, 187, 120, 0.2)",
          color: "#48bb78",
        };
      case "shipped":
        return {
          backgroundColor: "rgba(66, 153, 225, 0.2)",
          color: "#4299e1",
        };
      case "processing":
        return {
          backgroundColor: "rgba(237, 137, 54, 0.2)",
          color: "#ed8936",
        };
      default:
        return {
          backgroundColor: "rgba(160, 174, 192, 0.2)",
          color: "#a0aec0",
        };
    }
  };

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
            Analytics
          </h1>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                selectedPeriod === "today"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  selectedPeriod === "today" ? "#d4af37" : "transparent",
                color: selectedPeriod === "today" ? "#000000" : "#999999",
              }}
              onClick={() => setSelectedPeriod("today")}
            >
              Today
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                selectedPeriod === "week"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  selectedPeriod === "week" ? "#d4af37" : "transparent",
                color: selectedPeriod === "week" ? "#000000" : "#999999",
              }}
              onClick={() => setSelectedPeriod("week")}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                selectedPeriod === "month"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  selectedPeriod === "month" ? "#d4af37" : "transparent",
                color: selectedPeriod === "month" ? "#000000" : "#999999",
              }}
              onClick={() => setSelectedPeriod("month")}
            >
              Month
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div
            className="shadow rounded-lg p-5 transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center">
              <div
                className="flex-shrink-0 p-3 rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <FaUsers className="w-6 h-6" style={{ color: "#d4af37" }} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className="text-sm font-medium truncate"
                    style={{ color: "#999999" }}
                  >
                    Total Users
                  </dt>
                  <dd
                    className="text-lg font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {analytics.total_users}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className="shadow rounded-lg p-5 transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center">
              <div
                className="flex-shrink-0 p-3 rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <FaBox className="w-6 h-6" style={{ color: "#d4af37" }} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className="text-sm font-medium truncate"
                    style={{ color: "#999999" }}
                  >
                    Total Products
                  </dt>
                  <dd
                    className="text-lg font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {analytics.total_products}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className="shadow rounded-lg p-5 transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center">
              <div
                className="flex-shrink-0 p-3 rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <FaShoppingCart
                  className="w-6 h-6"
                  style={{ color: "#d4af37" }}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className="text-sm font-medium truncate"
                    style={{ color: "#999999" }}
                  >
                    Total Orders
                  </dt>
                  <dd
                    className="text-lg font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {analytics.total_orders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className="shadow rounded-lg p-5 transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center">
              <div
                className="flex-shrink-0 p-3 rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <FaEye className="w-6 h-6" style={{ color: "#d4af37" }} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className="text-sm font-medium truncate"
                    style={{ color: "#999999" }}
                  >
                    Page Views Today
                  </dt>
                  <dd
                    className="text-lg font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {analytics.page_views_today}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className="shadow rounded-lg p-5 transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center">
              <div
                className="flex-shrink-0 p-3 rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <FaMousePointer
                  className="w-6 h-6"
                  style={{ color: "#d4af37" }}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className="text-sm font-medium truncate"
                    style={{ color: "#999999" }}
                  >
                    Clicks Today
                  </dt>
                  <dd
                    className="text-lg font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {analytics.button_clicks_today}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: "#ffffff" }}>
                Revenue Overview
              </h3>
              <button
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "#d4af37" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(212, 175, 55, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <FaChartLine />
              </button>
            </div>
            <div
              className="h-64 flex items-center justify-center"
              style={{ backgroundColor: "#2d2d2d", borderRadius: "0.375rem" }}
            >
              <div className="text-center">
                <FaChartLine
                  className="mx-auto h-12 w-12 mb-2"
                  style={{ color: "#d4af37" }}
                />
                <p style={{ color: "#999999" }}>
                  Chart visualization would go here
                </p>
              </div>
            </div>
          </div>

          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: "#ffffff" }}>
                Top Products
              </h3>
              <button
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "#d4af37" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(212, 175, 55, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <FaBox />
              </button>
            </div>
            <div
              className="h-64 flex items-center justify-center"
              style={{ backgroundColor: "#2d2d2d", borderRadius: "0.375rem" }}
            >
              <div className="text-center">
                <FaBox
                  className="mx-auto h-12 w-12 mb-2"
                  style={{ color: "#d4af37" }}
                />
                <p style={{ color: "#999999" }}>
                  Top products list would go here
                </p>
              </div>
            </div>
          </div>
        </div>

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
                    backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
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
                            style={getStatusStyle(order.status)}
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
                          ${order.total_amount}
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
                            {new Date(order.created_at).toLocaleDateString()}
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
      </div>
    </div>
  );
};

export default Analytics;
