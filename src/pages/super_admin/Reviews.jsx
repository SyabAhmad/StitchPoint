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
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading reviews...</span>
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
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          Reviews Management
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
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
          <div>
            <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
              Rating Filter:
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 rounded"
              style={{
                backgroundColor: "#2d2d2d",
                color: "#ffffff",
                border: "1px solid #3d3d3d",
              }}
            >
              <option value="all">All Ratings</option>
              <option value="high">High (4-5 stars)</option>
              <option value="low">Low (1-2 stars)</option>
            </select>
          </div>
          <div className="flex-1 min-w-64">
            <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
              Search:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews, users, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 rounded"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
              />
              <FaSearch
                className="absolute left-3 top-3"
                style={{ color: "#cccccc" }}
              />
            </div>
          </div>
        </div>

        {/* Reviews List */}
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
              All Reviews ({pagination.total})
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
              View and manage all product reviews
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
                    Rating
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Review
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    User
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Product
                  </th>
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#1d1d1d" }}>
                {reviews.map((review, index) => (
                  <tr
                    key={review.id}
                    className="transition-colors duration-150 cursor-pointer"
                    style={{
                      borderBottom: "1px solid #2d2d2d",
                      backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1f1f1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                    }}
                    onClick={() => handleReviewClick(review.id)}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#ffffff" }}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">
                          {renderStars(review.rating)}
                        </span>
                        <span>({review.rating}/5)</span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: "#ffffff" }}
                    >
                      {review.comment}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      <div>
                        <div className="font-medium">{review.user_name}</div>
                        <div className="text-xs">{review.user_email}</div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {review.product_name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {review.store_name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reviews.length === 0 && (
              <div className="text-center py-8" style={{ color: "#999999" }}>
                No reviews found for the selected filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{pagination.pages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
