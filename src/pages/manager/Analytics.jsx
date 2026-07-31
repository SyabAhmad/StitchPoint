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
      total_views: 0, total_clicks: 0, total_cart_adds: 0, avg_time_spent: 0,
      top_products: [], total_reviews: 0, avg_rating: 0, total_comments: 0, avg_comments_per_product: 0,
    },
    productViews: [], productClicks: [], reviewsTrends: [], commentsTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [overviewRes, viewsRes, clicksRes, reviewsOverviewRes, reviewsTrendsRes, commentsTrendsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/analytics/overview?days=${filterDays}`, { headers }),
          fetch(`http://localhost:5000/api/analytics/product-views?days=${filterDays}`, { headers }),
          fetch(`http://localhost:5000/api/analytics/product-clicks?days=${filterDays}`, { headers }),
          fetch(`http://localhost:5000/api/analytics/reviews-overview?days=${filterDays}`, { headers }),
          fetch(`http://localhost:5000/api/analytics/reviews-trends?days=${filterDays}`, { headers }),
          fetch(`http://localhost:5000/api/analytics/comments-trends?days=${filterDays}`, { headers }),
        ]);
        const [overviewData, viewsData, clicksData, reviewsOverviewData, reviewsTrendsData, commentsTrendsData] = await Promise.all([
          overviewRes.json(), viewsRes.json(), clicksRes.json(),
          reviewsOverviewRes.json(), reviewsTrendsRes.json(), commentsTrendsRes.json(),
        ]);
        setAnalyticsData({
          overview: {
            ...(overviewData.overview || { total_views: 0, total_clicks: 0, total_cart_adds: 0, avg_time_spent: 0, top_products: [] }),
            ...(reviewsOverviewData.reviews_overview || { total_reviews: 0, avg_rating: 0, total_comments: 0, avg_comments_per_product: 0 }),
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
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-3"></div>
          <span className="text-white/40 text-sm">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gold-500">Analytics Dashboard</h2>
        <select
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40"
        >
          <option value={7} className="bg-[#111]">Last 7 days</option>
          <option value={30} className="bg-[#111]">Last 30 days</option>
          <option value={90} className="bg-[#111]">Last 90 days</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {["overview", "performance", "trends"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-gold-500 text-black"
                : "bg-white/5 text-white/40 hover:text-white/70"
            }`}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnalyticsPieChart data={analyticsData.overview} />
              <TopProductsList products={analyticsData.overview.top_products} />
            </div>
          </>
        )}
        {activeTab === "performance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProductViewsChart data={analyticsData.productViews} />
            <ProductClicksChart data={analyticsData.productClicks} />
          </div>
        )}
        {activeTab === "trends" && (
          <div className="space-y-4">
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
