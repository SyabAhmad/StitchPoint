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
} from "recharts";

const StoreAnalyticsDetail = () => {
  const { store_id } = useParams();
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading store analytics...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div
        className="p-8"
        style={{ backgroundColor: "#000000", minHeight: "100vh" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: "#d4af37" }}>
            Store Not Found
          </h1>
          <p style={{ color: "#999999" }} className="mt-4">
            The requested store analytics could not be found.
          </p>
          <Link
            to="/super-admin-dashboard/store-analytics"
            className="mt-4 inline-block"
            style={{ color: "#d4af37" }}
          >
            Back to Stores Analytics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
              {store.store_name}
            </h1>
            <p className="text-sm" style={{ color: "#999999" }}>
              Detailed analytics and products for this store
            </p>
          </div>
          <Link
            to="/super-admin-dashboard/store-analytics"
            className="px-3 py-1 rounded-md text-sm"
            style={{ backgroundColor: "#d4af37", color: "#000" }}
          >
            Back
          </Link>
        </div>

        {/* Store Summary - Full Width */}
        <div
          className="shadow rounded-lg p-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div>
            <h3
              style={{ color: "#ffffff" }}
              className="text-lg font-semibold mb-4"
            >
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
          <div style={{ color: "#cccccc" }} className="grid grid-cols-1 gap-2">
            <p>
              <span style={{ color: "#d4af37" }}>Total Products:</span>{" "}
              {store.total_products}
            </p>
            <p>
              <span style={{ color: "#d4af37" }}>Total Views:</span>{" "}
              {store.total_views}
            </p>
            <p>
              <span style={{ color: "#d4af37" }}>Total Clicks:</span>{" "}
              {store.total_clicks}
            </p>
            <p>
              <span style={{ color: "#d4af37" }}>Cart Adds:</span>{" "}
              {store.total_cart_adds}
            </p>
          </div>
          <div style={{ color: "#cccccc" }} className="grid grid-cols-1 gap-2">
            <p>
              <span style={{ color: "#d4af37" }}>Avg Time Spent:</span>{" "}
              {store.avg_time_spent}s
            </p>
            <p>
              <span style={{ color: "#d4af37" }}>Total Reviews:</span>{" "}
              {store.total_reviews}
            </p>
            <p>
              <span style={{ color: "#d4af37" }}>Avg Rating:</span>{" "}
              {store.avg_rating}
            </p>
            <p>
              <span style={{ color: "#d4af37" }}>Total Comments:</span>{" "}
              {store.total_comments}
            </p>
          </div>
        </div>

        {/* Clickable Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reviews Card */}
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}/reviews`}
            className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  style={{ color: "#d4af37" }}
                  className="text-lg font-semibold mb-2"
                >
                  Reviews
                </h3>
                <p style={{ color: "#cccccc" }} className="text-3xl font-bold">
                  {store.total_reviews}
                </p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </Link>

          {/* Comments Card */}
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}/comments`}
            className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  style={{ color: "#d4af37" }}
                  className="text-lg font-semibold mb-2"
                >
                  Comments
                </h3>
                <p style={{ color: "#cccccc" }} className="text-3xl font-bold">
                  {store.total_comments}
                </p>
              </div>
              <div className="text-5xl">💬</div>
            </div>
          </Link>

          {/* Products Card */}
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}/products`}
            className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  style={{ color: "#d4af37" }}
                  className="text-lg font-semibold mb-2"
                >
                  Products
                </h3>
                <p style={{ color: "#cccccc" }} className="text-3xl font-bold">
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
