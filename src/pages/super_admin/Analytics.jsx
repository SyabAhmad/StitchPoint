import React, { useState, useEffect } from "react";
import OverviewStats from "../../components/analytics/OverviewStats";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart";
import TopProductsList from "../../components/analytics/TopProductsList";
import ProductViewsChart from "../../components/analytics/ProductViewsChart";
import ProductClicksChart from "../../components/analytics/ProductClicksChart";
import ReviewTrendsChart from "../../components/analytics/ReviewTrendsChart";
import CommentTrendsChart from "../../components/analytics/CommentTrendsChart";
import AdvancedFilters from "../../components/analytics/AdvancedFilters";
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
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    customerSegment: "all",
    location: { country: "", city: "" },
    device: "all",
    trafficSource: "all",
    productCategory: "all",
    priceRange: { min: 0, max: 1000 },
    rating: "all",
    status: "all",
    search: "",
    active: false,
  });
  const [filteredAnalyticsData, setFilteredAnalyticsData] = useState(null);

  const periodToDays = (p) => {
    if (p === "today") return 1;
    if (p === "week") return 7;
    return 30;
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);

    // Apply filters to analytics data
    const filteredData = {
      ...analyticsData,
      overview: {
        ...analyticsData.overview,
        top_products: analyticsData.overview.top_products.filter((product) => {
          // Apply product category filter
          if (
            newFilters.productCategory !== "all" &&
            product.category !== newFilters.productCategory
          ) {
            return false;
          }

          // Apply price range filter
          if (
            product.price < newFilters.priceRange.min ||
            product.price > newFilters.priceRange.max
          ) {
            return false;
          }

          // Apply rating filter
          if (
            newFilters.rating !== "all" &&
            product.rating < parseInt(newFilters.rating)
          ) {
            return false;
          }

          return true;
        }),
      },
    };

    setFilteredAnalyticsData(filteredData);
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
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          fetch(
            `http://localhost:5000/api/analytics/product-clicks?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          fetch(
            `http://localhost:5000/api/analytics/reviews-overview?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          fetch(
            `http://localhost:5000/api/analytics/reviews-trends?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          fetch(
            `http://localhost:5000/api/analytics/comments-trends?days=${days}`,
            { headers: { Authorization: `Bearer ${token}` } },
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
        };
      case "shipped":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#cccccc",
        };
      case "processing":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#aaaaaa",
        };
      default:
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#888888",
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
          <h1 className="text-3xl font-bold" style={{ color: "#ffffff" }}>
            ANALYTICS
          </h1>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-bold tracking-widest uppercase transition-colors duration-200 ${
                selectedPeriod === "today"
                  ? "bg-white text-black"
                  : "text-gray-500 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  selectedPeriod === "today" ? "#ffffff" : "transparent",
                color: selectedPeriod === "today" ? "#000000" : "#888888",
              }}
              onClick={() => setSelectedPeriod("today")}
            >
              TODAY
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-bold tracking-widest uppercase transition-colors duration-200 ${
                selectedPeriod === "week"
                  ? "bg-white text-black"
                  : "text-gray-500 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  selectedPeriod === "week" ? "#ffffff" : "transparent",
                color: selectedPeriod === "week" ? "#000000" : "#888888",
              }}
              onClick={() => setSelectedPeriod("week")}
            >
              WEEK
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-bold tracking-widest uppercase transition-colors duration-200 ${
                selectedPeriod === "month"
                  ? "bg-white text-black"
                  : "text-gray-500 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  selectedPeriod === "month" ? "#ffffff" : "transparent",
                color: selectedPeriod === "month" ? "#000000" : "#888888",
              }}
              onClick={() => setSelectedPeriod("month")}
            >
              MONTH
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* Overview Stats */}
        <OverviewStats data={analyticsData.overview} />

        {/* Charts: Product Views & Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#111111" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#ffffff" }}>
                PRODUCT VIEWS
              </h3>
              <button
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "#ffffff" }}
              >
                <FaEye />
              </button>
            </div>
            <ProductViewsChart data={analyticsData.productViews} />
          </div>

          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#111111" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#ffffff" }}>
                PRODUCT CLICKS
              </h3>
              <button
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: "#ffffff" }}
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
            style={{ backgroundColor: "#111111" }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: "#ffffff" }}
            >
              TOP PRODUCTS
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
                className="px-3 py-1 rounded-md text-sm font-bold tracking-widest uppercase transition-colors duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#cccccc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                VIEW ALL
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
                          className="text-sm font-bold truncate mr-2 transition-colors duration-200 tracking-widest"
                          style={{ color: "#ffffff" }}
                        >
                          ORDER #{order.id}
                        </p>
                        <p className="flex-shrink-0 flex">
                          <span
                            className="px-2 inline-flex text-xs font-bold uppercase tracking-wider rounded-full"
                            style={getStatusStyle(order.status)}
                          >
                            {order.status}
                          </span>
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className="text-sm font-bold"
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
                              style={{ color: "#888888" }}
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
