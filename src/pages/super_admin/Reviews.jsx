import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    limit: 10,
  });
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [filterDays, ratingFilter, currentPage]);

  useEffect(() => {
    // Debounce search query
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchReviews();
    }, 500);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        days: filterDays,
        page: currentPage,
        limit: 10,
        search: searchQuery,
        rating_filter: ratingFilter,
      });
      const response = await fetch(
        `http://localhost:5000/api/analytics/reviews?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setReviews(data.reviews || []);
      setPagination(data.pagination || { total: 0, pages: 0, limit: 10 });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setPagination({ total: 0, pages: 0, limit: 10 });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (reviewId) => {
    navigate(`/super-admin-dashboard/reviews/${reviewId}`);
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-4"></div>
          <span>Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gold-500">
          Reviews Management
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
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
          <div>
            <label className="block text-sm mb-2 text-white/50">
              Rating Filter:
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
            >
              <option value="all">All Ratings</option>
              <option value="high">High (4-5 stars)</option>
              <option value="low">Low (1-2 stars)</option>
            </select>
          </div>
          <div className="flex-1 min-w-64">
            <label className="block text-sm mb-2 text-white/50">Search:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews, users, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
              />
              <FaSearch className="absolute left-3 top-3 text-white/30" />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-[#111] border border-white/5 rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-white/5">
            <h3 className="text-lg leading-6 font-medium text-white">
              All Reviews ({pagination.total})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-white/30">
              View and manage all product reviews
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="transition-colors duration-150 cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => handleReviewClick(review.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {renderStars(review.rating)}
                        </span>
                        <span>({review.rating}/5)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {review.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      <div>
                        <div className="font-medium">{review.user_name}</div>
                        <div className="text-xs">{review.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {review.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {review.store_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reviews.length === 0 && (
              <div className="text-center py-8 text-white/30">
                No reviews found for the selected filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-white/30">
                    Showing page{" "}
                    <span className="font-medium text-white">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {pagination.pages}
                    </span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-white/30 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                      <FaChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page >= currentPage - 2 && page <= currentPage + 2
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "z-10 bg-gold-500 border-gold-500 text-black"
                              : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-white/30 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                      <FaChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
