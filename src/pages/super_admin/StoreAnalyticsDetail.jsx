import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SalesChart from "../../components/analytics/SalesChart";
import ProfitChart from "../../components/analytics/ProfitChart";
import CostChart from "../../components/analytics/CostChart";

const StoreAnalyticsDetail = () => {
  const { store_id } = useParams();
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [financialTrends, setFinancialTrends] = useState([]);
  const [filterDays, setFilterDays] = useState(30);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const storeRes = await fetch(
          `http://localhost:5000/api/analytics/stores-analytics/${store_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const storeData = await storeRes.json();
        setStore(storeData.store || storeData);
      } catch (error) {
        console.error("Error fetching store detail:", error);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetail();
  }, [store_id]);

  useEffect(() => {
    const fetchFinancialTrends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/analytics/financial-trends?days=${filterDays}&store_id=${store_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setFinancialTrends(data.financial_trends || []);
      } catch (error) {
        console.error("Error fetching financial trends:", error);
        setFinancialTrends([]);
      }
    };

    fetchFinancialTrends();
  }, [store_id, filterDays]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-4"></div>
          <span>Loading store analytics...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-8 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gold-500">Store Not Found</h1>
          <p className="text-white/30 mt-4">
            The requested store analytics could not be found.
          </p>
          <Link
            to="/super-admin-dashboard/store-analytics"
            className="mt-4 inline-block text-gold-500 hover:underline"
          >
            Back to Stores Analytics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gold-500">
              {store.store_name}
            </h1>
            <p className="text-sm text-white/30">
              Detailed analytics and products for this store
            </p>
          </div>
          <Link
            to="/super-admin-dashboard/store-analytics"
            className="px-3 py-1 rounded-md text-sm bg-gold-500 text-black font-semibold hover:bg-gold-600 transition-colors"
          >
            Back
          </Link>
        </div>

        {/* Time Period Filter */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-white/50">
            Time Period:
          </label>
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Store Summary - Full Width */}
        <div className="bg-[#111] border border-white/5 rounded-lg p-8 mb-8 grid grid-cols-1 md:grid-cols-4 gap-8 shadow">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Store Summary
            </h3>
            {store.logo_url && (
              <img
                src={store.logo_url}
                alt={`${store.store_name} logo`}
                className="w-20 h-20 rounded-full mb-4"
              />
            )}
          </div>
          <div className="text-white/50 grid grid-cols-1 gap-2">
            <p>
              <span className="text-gold-500">Total Products:</span>{" "}
              {store.total_products}
            </p>
            <p>
              <span className="text-gold-500">Total Views:</span>{" "}
              {store.total_views}
            </p>
            <p>
              <span className="text-gold-500">Total Clicks:</span>{" "}
              {store.total_clicks}
            </p>
            <p>
              <span className="text-gold-500">Cart Adds:</span>{" "}
              {store.total_cart_adds}
            </p>
          </div>
          <div className="text-white/50 grid grid-cols-1 gap-2">
            <p>
              <span className="text-gold-500">Avg Time Spent:</span>{" "}
              {store.avg_time_spent}s
            </p>
            <p>
              <span className="text-gold-500">Total Reviews:</span>{" "}
              {store.total_reviews}
            </p>
            <p>
              <span className="text-gold-500">Avg Rating:</span>{" "}
              {store.avg_rating}
            </p>
            <p>
              <span className="text-gold-500">Total Comments:</span>{" "}
              {store.total_comments}
            </p>
          </div>
          <div className="text-white/50 grid grid-cols-1 gap-2">
            <p>
              <span className="text-gold-500">Total Revenue:</span> PKR{" "}
              {store.total_revenue || 0}
            </p>
            <p>
              <span className="text-gold-500">Units Sold:</span>{" "}
              {store.total_units_sold || 0}
            </p>
            <p>
              <span className="text-gold-500">Total Costs:</span> PKR{" "}
              {store.total_costs || 0}
            </p>
            <p>
              <span className="text-gold-500">Total Profit:</span> PKR{" "}
              {store.total_profit || 0}
            </p>
          </div>
        </div>

        {/* Financial Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111] border border-white/5 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Sales Trends
            </h3>
            <SalesChart data={financialTrends} />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Profit Trends
            </h3>
            <ProfitChart data={financialTrends} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111] border border-white/5 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Cost Analysis
            </h3>
            <CostChart data={financialTrends} />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Revenue Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Revenue", value: store.total_revenue || 0 },
                    { name: "Costs", value: store.total_costs || 0 },
                    { name: "Profit", value: store.total_profit || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    {
                      name: "Revenue",
                      value: store.total_revenue || 0,
                      fill: "#d4af37",
                    },
                    {
                      name: "Costs",
                      value: store.total_costs || 0,
                      fill: "#ff6b6b",
                    },
                    {
                      name: "Profit",
                      value: store.total_profit || 0,
                      fill: "#4ecdc4",
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`PKR ${value.toFixed(2)}`, ""]}
                  contentStyle={{
                    backgroundColor: "#1d1d1d",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    color: "#ffffff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clickable Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reviews Card */}
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}/reviews`}
            className="bg-[#111] border border-white/5 rounded-lg p-6 shadow cursor-pointer transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gold-500">
                  Reviews
                </h3>
                <p className="text-3xl font-bold text-white/50">
                  {store.total_reviews}
                </p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </Link>

          {/* Comments Card */}
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}/comments`}
            className="bg-[#111] border border-white/5 rounded-lg p-6 shadow cursor-pointer transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gold-500">
                  Comments
                </h3>
                <p className="text-3xl font-bold text-white/50">
                  {store.total_comments}
                </p>
              </div>
              <div className="text-5xl">💬</div>
            </div>
          </Link>

          {/* Products Card */}
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}/products`}
            className="bg-[#111] border border-white/5 rounded-lg p-6 shadow cursor-pointer transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gold-500">
                  Products
                </h3>
                <p className="text-3xl font-bold text-white/50">
                  {store.total_products}
                </p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalyticsDetail;
