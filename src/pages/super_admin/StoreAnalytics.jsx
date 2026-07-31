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
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-4"></div>
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
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gold-500">
          Store Analytics
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Filter and Search */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-2 text-white/50">
                  Time Period:
                </label>
                <select
                  value={filterDays}
                  onChange={(e) => setFilterDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-2 text-white/50">
                  Search Store:
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by store name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Stores Table */}
            <div className="bg-[#111] border border-white/5 rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-white/5">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Stores Performance
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-white/30">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredStores.length)} of{" "}
                  {filteredStores.length} stores
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Store
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Cart Adds
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Reviews
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Comments
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentStores.map((store) => (
                      <tr
                        key={store.store_id}
                        className="transition-colors duration-150 cursor-pointer hover:bg-white/[0.02]"
                        onClick={() =>
                          navigate(
                            `/super-admin-dashboard/store-analytics/${store.store_id}`
                          )
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {store.store_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_products}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_clicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_cart_adds}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_reviews}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.avg_rating}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_comments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-500">
                          PKR {store.total_revenue || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                          {store.total_units_sold || 0}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            store.total_profit >= 0
                              ? "text-teal-400"
                              : "text-red-400"
                          }`}
                        >
                          PKR {store.total_profit || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {currentStores.length === 0 && (
                  <div className="text-center py-8 text-white/30">
                    No stores found matching your search.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded text-sm font-medium bg-white/5 text-white border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? "bg-gold-500 text-black"
                            : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded text-sm font-medium bg-white/5 text-white border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Top 10 Stores Panel (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/5 rounded-lg p-4 shadow sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-gold-500">
                Top 10 Stores
              </h3>

              {/* Reviews Card */}
              <div className="mb-4 p-4 rounded-lg bg-white/5 cursor-pointer transition-transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">By Reviews</h4>
                  <FaStar className="text-gold-500" size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresByReviews.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span className="text-white/50 truncate">
                        {store.store_name}
                      </span>
                      <span className="font-medium text-gold-500">
                        {store.total_reviews}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Card */}
              <div className="mb-4 p-4 rounded-lg bg-white/5 cursor-pointer transition-transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">By Comments</h4>
                  <FaComment className="text-gold-500" size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresByComments.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span className="text-white/50 truncate">
                        {store.store_name}
                      </span>
                      <span className="font-medium text-gold-500">
                        {store.total_comments}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sells (Cart Adds) Card */}
              <div className="mb-4 p-4 rounded-lg bg-white/5 cursor-pointer transition-transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">By Cart Adds</h4>
                  <FaShoppingCart className="text-gold-500" size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresBySells.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span className="text-white/50 truncate">
                        {store.store_name}
                      </span>
                      <span className="font-medium text-gold-500">
                        {store.total_cart_adds}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Views Card */}
              <div className="p-4 rounded-lg bg-white/5 cursor-pointer transition-transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">By Views</h4>
                  <FaEye className="text-gold-500" size={20} />
                </div>
                <div className="space-y-2">
                  {topStoresByViews.slice(0, 3).map((store) => (
                    <div
                      key={store.store_id}
                      className="flex justify-between items-center text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/super-admin-dashboard/store-analytics/${store.store_id}`
                        );
                      }}
                    >
                      <span className="text-white/50 truncate">
                        {store.store_name}
                      </span>
                      <span className="font-medium text-gold-500">
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
