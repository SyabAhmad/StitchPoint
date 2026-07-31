import React, { useState, useEffect } from "react";
import OverviewStats from "../../components/analytics/OverviewStats";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart";
import TopProductsList from "../../components/analytics/TopProductsList";
import ProductViewsChart from "../../components/analytics/ProductViewsChart";
import ProductClicksChart from "../../components/analytics/ProductClicksChart";
import ReviewTrendsChart from "../../components/analytics/ReviewTrendsChart";
import CommentTrendsChart from "../../components/analytics/CommentTrendsChart";
import AdvancedFilters from "../../components/analytics/AdvancedFilters";
import { FaCalendarAlt } from "react-icons/fa";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_views: 0, total_clicks: 0, total_cart_adds: 0, avg_time_spent: 0,
      top_products: [], total_reviews: 0, avg_rating: 0, total_comments: 0, avg_comments_per_product: 0,
    },
    productViews: [], productClicks: [], reviewsTrends: [], commentsTrends: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null }, customerSegment: "all",
    location: { country: "", city: "" }, device: "all", trafficSource: "all",
    productCategory: "all", priceRange: { min: 0, max: 1000 }, rating: "all",
    status: "all", search: "", active: false,
  });

  const periodToDays = (p) => {
    if (p === "today") return 1;
    if (p === "week") return 7;
    return 30;
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("token");
        const days = periodToDays(selectedPeriod);
        const headers = { Authorization: `Bearer ${token}` };

        const [overviewRes, viewsRes, clicksRes, reviewsOverviewRes, reviewsTrendsRes, commentsTrendsRes, basicRes] =
          await Promise.all([
            fetch(`http://localhost:5000/api/analytics/overview?days=${days}`, { headers }),
            fetch(`http://localhost:5000/api/analytics/product-views?days=${days}`, { headers }),
            fetch(`http://localhost:5000/api/analytics/product-clicks?days=${days}`, { headers }),
            fetch(`http://localhost:5000/api/analytics/reviews-overview?days=${days}`, { headers }),
            fetch(`http://localhost:5000/api/analytics/reviews-trends?days=${days}`, { headers }),
            fetch(`http://localhost:5000/api/analytics/comments-trends?days=${days}`, { headers }),
            fetch("http://localhost:5000/api/dashboard/admin", { headers }),
          ]);

        const [overviewData, viewsData, clicksData, reviewsOverviewData, reviewsTrendsData, commentsTrendsData, basicData] =
          await Promise.all([overviewRes.json(), viewsRes.json(), clicksRes.json(), reviewsOverviewRes.json(), reviewsTrendsRes.json(), commentsTrendsRes.json(), basicRes.json()]);

        setAnalyticsData({
          overview: { ...(overviewData.overview || {}), ...(reviewsOverviewData.reviews_overview || {}) },
          productViews: viewsData.analytics || [],
          productClicks: clicksData.analytics || [],
          reviewsTrends: reviewsTrendsData.reviews_trends || [],
          commentsTrends: commentsTrendsData.comments_trends || [],
        });
        setRecentOrders(basicData.recent_orders || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-7 w-7 border-2 border-gold-500/20 border-t-gold-500"></div>
          <span className="text-sm text-white/30">Loading analytics...</span>
        </div>
      </div>
    );
  }

  const statusStyle = (s) => {
    if (s === "delivered") return "bg-emerald-500/15 text-emerald-400";
    if (s === "shipped") return "bg-sky-500/15 text-sky-400";
    if (s === "processing") return "bg-amber-500/15 text-amber-400";
    return "bg-white/5 text-white/30";
  };

  const periods = ["today", "week", "month"];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gold-500">Analytics</h1>
          <div className="flex items-center bg-[#111] border border-white/5 rounded-lg p-0.5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  selectedPeriod === p ? "bg-gold-500 text-black" : "text-white/30 hover:text-white/60"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <AdvancedFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />

        {/* Overview Stats */}
        <OverviewStats data={analyticsData.overview} />

        {/* Charts Row: Views + Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-[#111] border border-white/5 rounded-lg p-5">
            <h3 className="text-sm font-medium text-white/50 mb-4">Product Views</h3>
            <ProductViewsChart data={analyticsData.productViews} />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-lg p-5">
            <h3 className="text-sm font-medium text-white/50 mb-4">Product Clicks</h3>
            <ProductClicksChart data={analyticsData.productClicks} />
          </div>
        </div>

        {/* Row: Top Products + Trends + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#111] border border-white/5 rounded-lg p-5">
            <h3 className="text-sm font-medium text-white/50 mb-4">Top Products</h3>
            <TopProductsList products={analyticsData.overview.top_products} />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-lg p-5">
            <h3 className="text-sm font-medium text-white/50 mb-4">Engagement Breakdown</h3>
            <AnalyticsPieChart data={analyticsData.overview} />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-lg p-5">
            <h3 className="text-sm font-medium text-white/50 mb-4">Trends</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-white/25 uppercase tracking-wider mb-2">Reviews</p>
                <ReviewTrendsChart data={analyticsData.reviewsTrends} />
              </div>
              <div>
                <p className="text-[11px] text-white/25 uppercase tracking-wider mb-2">Comments</p>
                <CommentTrendsChart data={analyticsData.commentsTrends} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/50">Recent Orders</h3>
            <button className="text-xs text-gold-500 hover:text-gold-600 transition-colors">View All</button>
          </div>
          {recentOrders.length > 0 ? (
            <ul className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <li key={order.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gold-500">#{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white">${order.total_amount}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-white/25">
                    <span>{order.user_email}</span>
                    <span>·</span>
                    <FaCalendarAlt className="text-[10px] text-gold-500/40" />
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-white/20">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
