import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const ManagerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_views: 0,
      total_clicks: 0,
      total_cart_adds: 0,
      avg_time_spent: 0,
      top_products: [],
    },
    productViews: [],
    productClicks: [],
  });
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalytics();
  }, [filterDays]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const [overviewRes, viewsRes, clicksRes] = await Promise.all([
        fetch(
          `http://localhost:5000/api/analytics/overview?days=${filterDays}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          `http://localhost:5000/api/analytics/product-views?days=${filterDays}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          `http://localhost:5000/api/analytics/product-clicks?days=${filterDays}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      const [overviewData, viewsData, clicksData] = await Promise.all([
        overviewRes.json(),
        viewsRes.json(),
        clicksRes.json(),
      ]);

      setAnalyticsData({
        overview: overviewData.overview || {
          total_views: 0,
          total_clicks: 0,
          total_cart_adds: 0,
          avg_time_spent: 0,
          top_products: [],
        },
        productViews: viewsData.analytics || [],
        productClicks: clicksData.analytics || [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#d4af37", "#b8860b", "#daa520", "#f4e4bc", "#8b7355"];

  const pieData = [
    {
      name: "Views",
      value: analyticsData.overview.total_views,
      color: "#d4af37",
    },
    {
      name: "Clicks",
      value: analyticsData.overview.total_clicks,
      color: "#b8860b",
    },
    {
      name: "Cart Adds",
      value: analyticsData.overview.total_cart_adds,
      color: "#daa520",
    },
  ];

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
      className="p-8"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
        Analytics
      </h1>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
          Time Period:
        </label>
        <select
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
          className="px-3 py-2 rounded"
          style={{
            backgroundColor: "#2d2d2d",
            color: "#ffffff",
            border: "1px solid #3d3d3d",
          }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 space-x-2">
        {["overview", "views", "clicks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              activeTab === tab ? "bg-yellow-600" : "bg-gray-600"
            }`}
            style={{
              backgroundColor: activeTab === tab ? "#d4af37" : "#555555",
              color: activeTab === tab ? "#000000" : "#ffffff",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div
                className="shadow rounded-lg p-6"
                style={{ backgroundColor: "#1d1d1d" }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#d4af37" }}
                >
                  {analyticsData.overview.total_views}
                </div>
                <div className="text-sm" style={{ color: "#cccccc" }}>
                  Total Views
                </div>
              </div>
              <div
                className="shadow rounded-lg p-6"
                style={{ backgroundColor: "#1d1d1d" }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#b8860b" }}
                >
                  {analyticsData.overview.total_clicks}
                </div>
                <div className="text-sm" style={{ color: "#cccccc" }}>
                  Total Clicks
                </div>
              </div>
              <div
                className="shadow rounded-lg p-6"
                style={{ backgroundColor: "#1d1d1d" }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#daa520" }}
                >
                  {analyticsData.overview.total_cart_adds}
                </div>
                <div className="text-sm" style={{ color: "#cccccc" }}>
                  Cart Adds
                </div>
              </div>
              <div
                className="shadow rounded-lg p-6"
                style={{ backgroundColor: "#1d1d1d" }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#f4e4bc" }}
                >
                  {analyticsData.overview.avg_time_spent}s
                </div>
                <div className="text-sm" style={{ color: "#cccccc" }}>
                  Avg Time Spent
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div
              className="shadow rounded-lg p-6 mb-8"
              style={{ backgroundColor: "#1d1d1d" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#d4af37" }}
              >
                Analytics Overview
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div
              className="shadow rounded-lg p-6"
              style={{ backgroundColor: "#1d1d1d" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#d4af37" }}
              >
                Top Products by Views
              </h3>
              <div className="space-y-2">
                {analyticsData.overview.top_products
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.product_id}
                      className="flex justify-between items-center p-3 rounded"
                      style={{ backgroundColor: "#2d2d2d" }}
                    >
                      <span style={{ color: "#ffffff" }}>{product.name}</span>
                      <span style={{ color: "#d4af37" }}>
                        {product.views} views
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "views" && (
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#d4af37" }}
            >
              Product Views
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.productViews.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                  <XAxis
                    dataKey="product_name"
                    stroke="#cccccc"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#cccccc" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d2d2d",
                      border: "1px solid #3d3d3d",
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="views" fill="#d4af37" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "clicks" && (
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#d4af37" }}
            >
              Product Clicks
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.productClicks.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                  <XAxis
                    dataKey="product_name"
                    stroke="#cccccc"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#cccccc" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d2d2d",
                      border: "1px solid #3d3d3d",
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="clicks" fill="#b8860b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAnalytics;
