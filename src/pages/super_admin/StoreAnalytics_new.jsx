import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StoreAnalytics = () => {
  const [storesAnalytics, setStoresAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/analytics/stores-analytics?days=${filterDays}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setStoresAnalytics(data.stores_analytics || []);
        setCurrentPage(1); // Reset to first page when filter changes
      } catch (error) {
        console.error("Error fetching stores analytics:", error);
        setStoresAnalytics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresAnalytics();
  }, [filterDays]);

  // Filter stores based on search term
  const filteredStores = storesAnalytics.filter((store) =>
    store.store_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStores = filteredStores.slice(startIdx, startIdx + itemsPerPage);

  // Get top 10 stores by a specific metric
  const getTop10Stores = (metric) => {
    return [...storesAnalytics]
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, 10);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading stores analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Table */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
            Store Analytics
          </h1>

          {/* Filter and Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
                Search Store:
              </label>
              <input
                type="text"
                placeholder="Enter store name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
              />
            </div>

            {/* Time Period Filter */}
            <div>
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
          </div>

          {/* Stores Table */}
          <div
            className="shadow overflow-hidden sm:rounded-md"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div
              className="px-4 py-5 sm:px-6 border-b"
              style={{ borderColor: "#2d2d2d" }}
            >
              <h3
                className="text-lg leading-6 font-medium"
                style={{ color: "#ffffff" }}
              >
                Stores Performance
              </h3>
              <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
                Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredStores.length)} of {filteredStores.length} stores
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead style={{ backgroundColor: "#2d2d2d" }}>
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Store
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Total Products
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Views
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Clicks
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Cart Adds
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Avg Time
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Reviews
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Avg Rating
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#d4af37" }}
                    >
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#1d1d1d" }}>
                  {paginatedStores.map((store, index) => (
                    <tr
                      key={store.store_id}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid #2d2d2d",
                        backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1f1f1f";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                      }}
                      onClick={() =>
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        )
                      }
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        style={{ color: "#ffffff" }}
                      >
                        {store.store_name}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.total_products}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.total_views}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.total_clicks}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.total_cart_adds}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.avg_time_spent}s
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.total_reviews}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.avg_rating}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {store.total_comments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginatedStores.length === 0 && (
                <div className="text-center py-8" style={{ color: "#999999" }}>
                  No stores found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="px-4 py-3 sm:px-6 flex items-center justify-between border-t"
                style={{ borderColor: "#2d2d2d" }}
              >
                <div style={{ color: "#999999" }} className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                    style={{
                      backgroundColor: "#d4af37",
                      color: "#000",
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                    style={{
                      backgroundColor: "#d4af37",
                      color: "#000",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Top 10 Stores Panel */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#d4af37" }}>
            Top 10 Stores
          </h2>

          {/* Top Stores Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Reviews Card */}
            <div
              className="shadow rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: "#1d1d1d" }}
              onClick={() => {
                // Could navigate to a detailed reviews page or scroll to filtered view
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    style={{ color: "#d4af37" }}
                    className="text-sm font-semibold mb-1"
                  >
                    Top by Reviews
                  </h3>
                  <p style={{ color: "#cccccc" }} className="text-xs">
                    {getTop10Stores("total_reviews")
                      .slice(0, 3)
                      .map((s) => s.store_name)
                      .join(", ")}
                  </p>
                  <p style={{ color: "#d4af37" }} className="text-lg font-bold mt-2">
                    {getTop10Stores("total_reviews")[0]?.total_reviews || 0}
                  </p>
                </div>
                <div className="text-3xl">⭐</div>
              </div>
            </div>

            {/* Comments Card */}
            <div
              className="shadow rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: "#1d1d1d" }}
              onClick={() => {
                // Could navigate to a detailed comments page
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    style={{ color: "#d4af37" }}
                    className="text-sm font-semibold mb-1"
                  >
                    Top by Comments
                  </h3>
                  <p style={{ color: "#cccccc" }} className="text-xs">
                    {getTop10Stores("total_comments")
                      .slice(0, 3)
                      .map((s) => s.store_name)
                      .join(", ")}
                  </p>
                  <p style={{ color: "#d4af37" }} className="text-lg font-bold mt-2">
                    {getTop10Stores("total_comments")[0]?.total_comments || 0}
                  </p>
                </div>
                <div className="text-3xl">💬</div>
              </div>
            </div>

            {/* Sales (Cart Adds) Card */}
            <div
              className="shadow rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: "#1d1d1d" }}
              onClick={() => {
                // Could navigate to a detailed sales page
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    style={{ color: "#d4af37" }}
                    className="text-sm font-semibold mb-1"
                  >
                    Top by Sales
                  </h3>
                  <p style={{ color: "#cccccc" }} className="text-xs">
                    {getTop10Stores("total_cart_adds")
                      .slice(0, 3)
                      .map((s) => s.store_name)
                      .join(", ")}
                  </p>
                  <p style={{ color: "#d4af37" }} className="text-lg font-bold mt-2">
                    {getTop10Stores("total_cart_adds")[0]?.total_cart_adds || 0}
                  </p>
                </div>
                <div className="text-3xl">🛒</div>
              </div>
            </div>

            {/* Views Card */}
            <div
              className="shadow rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: "#1d1d1d" }}
              onClick={() => {
                // Could navigate to a detailed views page
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    style={{ color: "#d4af37" }}
                    className="text-sm font-semibold mb-1"
                  >
                    Top by Views
                  </h3>
                  <p style={{ color: "#cccccc" }} className="text-xs">
                    {getTop10Stores("total_views")
                      .slice(0, 3)
                      .map((s) => s.store_name)
                      .join(", ")}
                  </p>
                  <p style={{ color: "#d4af37" }} className="text-lg font-bold mt-2">
                    {getTop10Stores("total_views")[0]?.total_views || 0}
                  </p>
                </div>
                <div className="text-3xl">👁️</div>
              </div>
            </div>
          </div>

          {/* Top 10 List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#d4af37" }}>
              Complete Top 10 Rankings
            </h3>
            <div
              className="shadow rounded-lg overflow-hidden"
              style={{ backgroundColor: "#1d1d1d" }}
            >
              <div
                className="px-4 py-2 border-b"
                style={{ borderColor: "#2d2d2d", backgroundColor: "#2d2d2d" }}
              >
                <h4 style={{ color: "#ffffff" }} className="text-sm font-medium">
                  By Views
                </h4>
              </div>
              <div className="divide-y" style={{ borderColor: "#2d2d2d" }}>
                {getTop10Stores("total_views").map((store, idx) => (
                  <div
                    key={store.store_id}
                    className="px-4 py-2 flex items-center justify-between hover:bg-gray-800 transition-colors"
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                    }}
                  >
                    <div>
                      <p style={{ color: "#ffffff" }} className="text-xs font-medium">
                        #{idx + 1} {store.store_name}
                      </p>
                    </div>
                    <p style={{ color: "#d4af37" }} className="text-sm font-bold">
                      {store.total_views}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
