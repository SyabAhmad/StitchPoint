import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaStar,
  FaComment,
  FaEye,
  FaShoppingCart,
} from "react-icons/fa";

const StoreAnalytics = () => {
  const [storesAnalytics, setStoresAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
      } catch (error) {
        console.error("Error fetching stores analytics:", error);
        setStoresAnalytics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresAnalytics();
  }, [filterDays]);

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

  // Filter and search logic
  const filteredStores = storesAnalytics.filter((store) =>
    store.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStores = filteredStores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

  // Top 10 stores by different metrics
  const topStoresByReviews = [...storesAnalytics]
    .sort((a, b) => b.total_reviews - a.total_reviews)
    .slice(0, 10);
  const topStoresByComments = [...storesAnalytics]
    .sort((a, b) => b.total_comments - a.total_comments)
    .slice(0, 10);
  const topStoresBySells = [...storesAnalytics]
    .sort((a, b) => b.total_cart_adds - a.total_cart_adds)
    .slice(0, 10);
  const topStoresByViews = [...storesAnalytics]
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 10);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          Store Analytics
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Filter and Search */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#cccccc" }}
                >
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
              <div className="flex-1">
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#cccccc" }}
                >
                  Search Store:
                </label>
                <div className="relative">
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#999999" }}
                  />
                  <input
                    type="text"
                    placeholder="Search by store name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-3 py-2 rounded"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#ffffff",
                      border: "1px solid #3d3d3d",
                    }}
                  />
                </div>
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
                <p
                  className="mt-1 max-w-2xl text-sm"
                  style={{ color: "#999999" }}
                >
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredStores.length)} of{" "}
                  {filteredStores.length} stores
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
                        Products
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
                        Reviews
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: "#d4af37" }}
                      >
                        Rating
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
                    {currentStores.map((store, index) => (
                      <tr
                        key={store.store_id}
                        className="transition-colors duration-150"
                        style={{
                          borderBottom: "1px solid #2d2d2d",
                          backgroundColor:
                            index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#3d3d3d";
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
                {currentStores.length === 0 && (
                  <div
                    className="text-center py-8"
                    style={{ color: "#999999" }}
                  >
                    No stores found matching your search.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className="px-4 py-4 border-t flex items-center justify-between"
                  style={{ borderColor: "#2d2d2d" }}
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#ffffff",
                      border: "1px solid #3d3d3d",
                    }}
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className="px-3 py-1 rounded text-sm font-medium"
                        style={{
                          backgroundColor:
                            currentPage === i + 1 ? "#d4af37" : "#2d2d2d",
                          color: currentPage === i + 1 ? "#000000" : "#ffffff",
                          border: "1px solid #3d3d3d",
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#ffffff",
                      border: "1px solid #3d3d3d",
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Top 10 Stores Panel (1/3 width) */}
          <div className="lg:col-span-1">
            <div
              className="shadow rounded-lg p-4 sticky top-8"
              style={{ backgroundColor: "#1d1d1d" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#d4af37" }}
              >
                Top 10 Stores
              </h3>

              {/* Reviews Card */}
              <div
                className="mb-4 p-4 rounded-lg cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: "#2d2d2d" }}
                onClick={() => {
                  // Could open a modal or navigate to filtered view
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ color: "#ffffff" }} className="font-medium">
                    By Reviews
                  </h4>
                  <FaStar style={{ color: "#d4af37" }} size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresByReviews.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span style={{ color: "#cccccc" }} className="truncate">
                        {store.store_name}
                      </span>
                      <span
                        style={{ color: "#d4af37" }}
                        className="font-medium"
                      >
                        {store.total_reviews}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Card */}
              <div
                className="mb-4 p-4 rounded-lg cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: "#2d2d2d" }}
                onClick={() => {
                  // Could open a modal or navigate to filtered view
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ color: "#ffffff" }} className="font-medium">
                    By Comments
                  </h4>
                  <FaComment style={{ color: "#d4af37" }} size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresByComments.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span style={{ color: "#cccccc" }} className="truncate">
                        {store.store_name}
                      </span>
                      <span
                        style={{ color: "#d4af37" }}
                        className="font-medium"
                      >
                        {store.total_comments}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sells (Cart Adds) Card */}
              <div
                className="mb-4 p-4 rounded-lg cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: "#2d2d2d" }}
                onClick={() => {
                  // Could open a modal or navigate to filtered view
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ color: "#ffffff" }} className="font-medium">
                    By Cart Adds
                  </h4>
                  <FaShoppingCart style={{ color: "#d4af37" }} size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresBySells.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span style={{ color: "#cccccc" }} className="truncate">
                        {store.store_name}
                      </span>
                      <span
                        style={{ color: "#d4af37" }}
                        className="font-medium"
                      >
                        {store.total_cart_adds}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Views Card */}
              <div
                className="p-4 rounded-lg cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: "#2d2d2d" }}
                onClick={() => {
                  // Could open a modal or navigate to filtered view
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ color: "#ffffff" }} className="font-medium">
                    By Views
                  </h4>
                  <FaEye style={{ color: "#d4af37" }} size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresByViews.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span style={{ color: "#cccccc" }} className="truncate">
                        {store.store_name}
                      </span>
                      <span
                        style={{ color: "#d4af37" }}
                        className="font-medium"
                      >
                        {store.total_views}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
