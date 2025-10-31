import React, { useState, useEffect } from "react";
import OverviewStats from "../../components/analytics/OverviewStats";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart";
import TopProductsList from "../../components/analytics/TopProductsList";
import ProductViewsChart from "../../components/analytics/ProductViewsChart";
import ProductClicksChart from "../../components/analytics/ProductClicksChart";
import RevenueChart from "../../components/analytics/RevenueChart";
import ReviewTrendsChart from "../../components/analytics/ReviewTrendsChart";
import CommentTrendsChart from "../../components/analytics/CommentTrendsChart";

const ManagerAnalytics = () => {
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
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const [
          overviewRes,
          viewsRes,
          clicksRes,
          reviewsOverviewRes,
          reviewsTrendsRes,
          commentsTrendsRes,
        ] = await Promise.all([
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
          fetch(
            `http://localhost:5000/api/analytics/reviews-overview?days=${filterDays}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `http://localhost:5000/api/analytics/reviews-trends?days=${filterDays}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `http://localhost:5000/api/analytics/comments-trends?days=${filterDays}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const [
          overviewData,
          viewsData,
          clicksData,
          reviewsOverviewData,
          reviewsTrendsData,
          commentsTrendsData,
        ] = await Promise.all([
          overviewRes.json(),
          viewsRes.json(),
          clicksRes.json(),
          reviewsOverviewRes.json(),
          reviewsTrendsRes.json(),
          commentsTrendsRes.json(),
        ]);

        setAnalyticsData({
          overview: {
            ...(overviewData.overview || {
              total_views: 0,
              total_clicks: 0,
              total_cart_adds: 0,
              avg_time_spent: 0,
              top_products: [],
            }),
            ...(reviewsOverviewData.reviews_overview || {
              total_reviews: 0,
              avg_rating: 0,
              total_comments: 0,
              avg_comments_per_product: 0,
            }),
          },
          productViews: viewsData.analytics || [],
          productClicks: clicksData.analytics || [],
          reviewsTrends: reviewsTrendsData.reviews_trends || [],
          commentsTrends: commentsTrendsData.comments_trends || [],
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [filterDays]);

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

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
        Analytics Dashboard
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
        {["overview", "performance", "trends"].map((tab) => (
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
            <OverviewStats data={analyticsData.overview} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsPieChart data={analyticsData.overview} />
              <TopProductsList products={analyticsData.overview.top_products} />
            </div>
          </>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductViewsChart data={analyticsData.productViews} />
            <ProductClicksChart data={analyticsData.productClicks} />
          </div>
        )}

        {activeTab === "trends" && (
          <div className="grid grid-cols-1 gap-6">
            <RevenueChart />
            <ReviewTrendsChart data={analyticsData.reviewsTrends} />
            <CommentTrendsChart data={analyticsData.commentsTrends} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAnalytics;
