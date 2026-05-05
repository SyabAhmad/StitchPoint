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

const AnalyticsAside = ({ userRole }) => {
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

  const COLORS = ["#ffffff", "#cccccc", "#999999", "#666666", "#333333"];

  const pieData = [
    {
      name: "Views",
      value: analyticsData.overview.total_views,
      color: "#ffffff",
    },
    {
      name: "Clicks",
      value: analyticsData.overview.total_clicks,
      color: "#cccccc",
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
        className="w-80 p-4"
        style={{ backgroundColor: "#1d1d1d", color: "#ffffff" }}
      >
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-80 p-4"
      style={{ backgroundColor: "#1d1d1d", color: "#ffffff" }}
    >
      <h3 className="text-lg font-semibold tracking-widest uppercase mb-4" style={{ color: "#ffffff" }}>
        PRODUCT ANALYTICS
      </h3>

      {/* Filter */}
      <div className="mb-4">
        <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
          Time Period:
        </label>
        <select
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
          className="w-full px-3 py-2 rounded"
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
      <div className="flex mb-4 space-x-1">
        {["overview", "views", "clicks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === tab ? "bg-white" : "bg-gray-700"
            }`}
            style={{
              backgroundColor: activeTab === tab ? "#ffffff" : "#555555",
              color: activeTab === tab ? "#000000" : "#ffffff",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "overview" && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="p-3 rounded"
                style={{ backgroundColor: "#2d2d2d" }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#ffffff" }}
                >
                  {analyticsData.overview.total_views}
                </div>
                <div className="text-xs" style={{ color: "#cccccc" }}>
                  TOTAL VIEWS
                </div>
              </div>
              <div
                className="p-3 rounded"
                style={{ backgroundColor: "#2d2d2d" }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#cccccc" }}
                >
                  {analyticsData.overview.total_clicks}
                </div>
                <div className="text-xs" style={{ color: "#cccccc" }}>
                  TOTAL CLICKS
                </div>
              </div>
              <div
                className="p-3 rounded"
                style={{ backgroundColor: "#2d2d2d" }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#999999" }}
                >
                  {analyticsData.overview.total_cart_adds}
                </div>
                <div className="text-xs" style={{ color: "#cccccc" }}>
                  CART ADDS
                </div>
              </div>
              <div
                className="p-3 rounded"
                style={{ backgroundColor: "#2d2d2d" }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#666666" }}
                >
                  {analyticsData.overview.avg_time_spent}s
                </div>
                <div className="text-xs" style={{ color: "#cccccc" }}>
                  AVG TIME
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
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

            {/* Top Products */}
            <div>
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Top Products by Views
              </h4>
              <div className="space-y-1">
                {analyticsData.overview.top_products
                  .slice(0, 3)
                  .map((product, index) => (
                    <div
                      key={product.product_id}
                      className="flex justify-between text-sm"
                    >
                      <span style={{ color: "#cccccc" }}>{product.name}</span>
                      <span style={{ color: "#ffffff" }}>{product.views}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "views" && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.productViews.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                <XAxis
                  dataKey="product_name"
                  stroke="#cccccc"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#cccccc" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #3d3d3d",
                    color: "#ffffff",
                  }}
                />
                <Bar dataKey="views" fill="#ffffff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "clicks" && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.productClicks.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                <XAxis
                  dataKey="product_name"
                  stroke="#cccccc"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#cccccc" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #3d3d3d",
                    color: "#ffffff",
                  }}
                />
                <Bar dataKey="clicks" fill="#cccccc" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsAside;
