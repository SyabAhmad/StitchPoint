import React, { useState, useEffect } from "react";
import OverviewStats from "../../components/analytics/OverviewStats";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart";
import TopProductsList from "../../components/analytics/TopProductsList";
import ProductViewsChart from "../../components/analytics/ProductViewsChart";
import ProductClicksChart from "../../components/analytics/ProductClicksChart";
import RevenueChart from "../../components/analytics/RevenueChart";
import ReviewTrendsChart from "../../components/analytics/ReviewTrendsChart";
import CommentTrendsChart from "../../components/analytics/CommentTrendsChart";
import CostChart from "../../components/analytics/CostChart";
import ProfitChart from "../../components/analytics/ProfitChart";
import CommissionChart from "../../components/analytics/CommissionChart";

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
    viewsSummary: { total: 0, today: 0, this_week: 0, this_month: 0, daily: [] },
    clicksSummary: { total: 0, today: 0, this_week: 0, this_month: 0, daily: [] },
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
          viewsSummaryRes,
          clicksSummaryRes,
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
          fetch(
            "http://localhost:5000/api/analytics/views-summary",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "http://localhost:5000/api/analytics/clicks-summary",
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
          viewsSummaryData,
          clicksSummaryResData,
        ] = await Promise.all([
          overviewRes.json(),
          viewsRes.json(),
          clicksRes.json(),
          reviewsOverviewRes.json(),
          reviewsTrendsRes.json(),
          commentsTrendsRes.json(),
          viewsSummaryRes.json(),
          clicksSummaryRes.json(),
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
          viewsSummary: viewsSummaryData || { total: 0, today: 0, this_week: 0, this_month: 0, daily: [] },
          clicksSummary: clicksSummaryResData || { total: 0, today: 0, this_week: 0, this_month: 0, daily: [] },
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
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
      <h1 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>
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
      <div className="flex mb-6 space-x-2 flex-wrap">
        {["overview", "performance", "trends", "financial"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              activeTab === tab ? "bg-white" : "bg-gray-600"
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
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            <OverviewStats data={analyticsData.overview} />
            
            {/* Views Summary */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: "#1a1a1a" }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>Views Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>Today</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.viewsSummary.today || 0}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>This Week</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.viewsSummary.this_week || 0}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>This Month</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.viewsSummary.this_month || 0}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>Total</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.viewsSummary.total || 0}</p>
                </div>
              </div>
              {/* Simple bar chart for daily views */}
              <div className="mt-4">
                <h4 className="text-sm font-bold mb-2" style={{ color: "#ccc" }}>Daily Views - Last 30 Days</h4>
                <div className="relative h-32 w-full">
                  {(analyticsData.viewsSummary.daily && analyticsData.viewsSummary.daily.length > 0) ? (
                    <div className="flex items-end h-full gap-px w-full">
                      {analyticsData.viewsSummary.daily.map((day, idx) => {
                        const dailyArr = analyticsData.viewsSummary.daily || [];
                        const maxV = Math.max(...dailyArr.map(d => d.views || 0), 1);
                        const barHeight = day.views > 0 ? Math.max((day.views / maxV) * 100, 10) : 4;
                        return (
                          <div 
                            key={idx} 
                            className="flex-1 bg-yellow-500 hover:bg-yellow-400 rounded-t transition-all"
                            style={{ height: `${barHeight}%`, minWidth: '3px' }}
                            title={`${day.date}: ${day.views} views`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No view data available
                    </div>
                  )}
                </div>
                {analyticsData.viewsSummary.daily && analyticsData.viewsSummary.daily.length > 0 && (
                  <div className="flex justify-between text-xs mt-1" style={{ color: "#888" }}>
                    <span>{analyticsData.viewsSummary.daily[0]?.date?.slice(5) || '-'}</span>
                    <span>{analyticsData.viewsSummary.daily[analyticsData.viewsSummary.daily.length - 1]?.date?.slice(5) || '-'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Clicks Summary */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: "#1a1a1a" }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>Clicks Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>Today</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.clicksSummary.today || 0}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>This Week</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.clicksSummary.this_week || 0}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>This Month</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.clicksSummary.this_month || 0}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
                  <span className="text-xs font-bold uppercase" style={{ color: "#888" }}>Total</span>
                  <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.clicksSummary.total || 0}</p>
                </div>
              </div>
              {/* Simple bar chart for daily clicks */}
              <div className="mt-4">
                <h4 className="text-sm font-bold mb-2" style={{ color: "#ccc" }}>Daily Clicks - Last 30 Days</h4>
                <div className="relative h-32 w-full">
                  {(analyticsData.clicksSummary.daily && analyticsData.clicksSummary.daily.length > 0) ? (
                    <div className="flex items-end h-full gap-px w-full">
                      {analyticsData.clicksSummary.daily.map((day, idx) => {
                        const dailyArr = analyticsData.clicksSummary.daily || [];
                        const maxC = Math.max(...dailyArr.map(d => d.clicks || 0), 1);
                        const barHeight = day.clicks > 0 ? Math.max((day.clicks / maxC) * 100, 10) : 4;
                        return (
                          <div 
                            key={idx} 
                            className="flex-1 bg-blue-500 hover:bg-blue-400 rounded-t transition-all"
                            style={{ height: `${barHeight}%`, minWidth: '3px' }}
                            title={`${day.date}: ${day.clicks} clicks`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No click data available
                    </div>
                  )}
                </div>
                {analyticsData.clicksSummary.daily && analyticsData.clicksSummary.daily.length > 0 && (
                  <div className="flex justify-between text-xs mt-1" style={{ color: "#888" }}>
                    <span>{analyticsData.clicksSummary.daily[0]?.date?.slice(5) || '-'}</span>
                    <span>{analyticsData.clicksSummary.daily[analyticsData.clicksSummary.daily.length - 1]?.date?.slice(5) || '-'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalyticsPieChart data={analyticsData.overview} />
              </div>
              <TopProductsList products={analyticsData.overview.top_products} />
            </div>
            {/* Reviews & Comments Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-white/20" style={{ backgroundColor: "#1a1a1a" }}>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#ffffff" }}>Total Reviews</h3>
                <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.overview.total_reviews || 0}</p>
              </div>
              <div className="p-4 rounded-lg border border-white/20" style={{ backgroundColor: "#1a1a1a" }}>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#ffffff" }}>Avg Rating</h3>
                <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.overview.avg_rating?.toFixed(1) || "0.0"}</p>
              </div>
              <div className="p-4 rounded-lg border border-white/20" style={{ backgroundColor: "#1a1a1a" }}>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#ffffff" }}>Total Comments</h3>
                <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{analyticsData.overview.total_comments || 0}</p>
              </div>
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

        {activeTab === "financial" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <CostChart />
            <ProfitChart />
            <CommissionChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAnalytics;
