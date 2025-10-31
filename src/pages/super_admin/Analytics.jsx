import React, { useState, useEffect } from "react";
import OverviewStats from "../../components/analytics/OverviewStats";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart";
import TopProductsList from "../../components/analytics/TopProductsList";
import ProductViewsChart from "../../components/analytics/ProductViewsChart";
import ProductClicksChart from "../../components/analytics/ProductClicksChart";
import ReviewTrendsChart from "../../components/analytics/ReviewTrendsChart";
import CommentTrendsChart from "../../components/analytics/CommentTrendsChart";
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
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_views: 0,
      total_clicks: 0,
      total_cart_adds: 0,
      avg_time_spent: 0,
      top_products: [],
      total_reviews: 0,
      avg_rating: 0,
      total_comments: 0,
      avg_comments_per_product: 0,
    },
    productViews: [],
    productClicks: [],
    reviewsTrends: [],
    commentsTrends: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const periodToDays = (p) => {
    if (p === "today") return 1;
    if (p === "week") return 7;
    return 30;
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const days = periodToDays(selectedPeriod);

        const [
          overviewRes,
          viewsRes,
          clicksRes,
          reviewsOverviewRes,
          reviewsTrendsRes,
          commentsTrendsRes,
          basicRes,
        ] = await Promise.all([
          fetch(`http://localhost:5000/api/analytics/overview?days=${days}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `http://localhost:5000/api/analytics/product-views?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `http://localhost:5000/api/analytics/product-clicks?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `http://localhost:5000/api/analytics/reviews-overview?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `http://localhost:5000/api/analytics/reviews-trends?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `http://localhost:5000/api/analytics/comments-trends?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch("http://localhost:5000/api/dashboard/admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [
          overviewData,
          viewsData,
          clicksData,
          reviewsOverviewData,
          reviewsTrendsData,
          commentsTrendsData,
          basicData,
        ] = await Promise.all([
          overviewRes.json(),
          viewsRes.json(),
          clicksRes.json(),
          reviewsOverviewRes.json(),
          reviewsTrendsRes.json(),
          commentsTrendsRes.json(),
          basicRes.json(),
        ]);

        setAnalyticsData({
          overview: {
            ...(overviewData.overview || {}),
            ...(reviewsOverviewData.reviews_overview || {}),
          },
          productViews: viewsData.analytics || [],
          productClicks: clicksData.analytics || [],
          reviewsTrends: reviewsTrendsData.reviews_trends || [],
          commentsTrends: commentsTrendsData.comments_trends || [],
        });

        setRecentOrders(basicData.recent_orders || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setAnalyticsData((p) => p);
        setRecentOrders([]);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedPeriod]);

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

        {/* Overview Stats */}
        <OverviewStats data={analyticsData.overview} />

        {/* Charts: Product Views & Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: "#ffffff" }}>
                Product Views
              </h3>
              <button
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "#d4af37" }}
              >
                <FaEye />
              </button>
            </div>
            <ProductViewsChart data={analyticsData.productViews} />
          </div>

          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: "#ffffff" }}>
                Product Clicks
              </h3>
              <button
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "#d4af37" }}
              >
                <FaMousePointer />
              </button>
            </div>
            <ProductClicksChart data={analyticsData.productClicks} />
          </div>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: "#ffffff" }}
            >
              Top Products
            </h3>
            <TopProductsList products={analyticsData.overview.top_products} />
          </div>

          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: "#ffffff" }}
            >
              Trends
            </h3>
            <div className="space-y-4">
              <ReviewTrendsChart data={analyticsData.reviewsTrends} />
              <CommentTrendsChart data={analyticsData.commentsTrends} />
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
