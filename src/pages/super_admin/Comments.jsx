import React, { useState, useEffect } from "react";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [limit] = useState(10); // Fixed limit for now, can be made configurable later

  useEffect(() => {
    fetchComments();
  }, [filterDays, currentPage]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/analytics/comments?days=${filterDays}&page=${currentPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setComments(data.comments || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalComments(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
      setTotalPages(1);
      setTotalComments(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-4"></div>
          <span>Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gold-500">
          Comments Management
        </h1>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-white/50">
            Time Period:
          </label>
          <select
            value={filterDays}
            onChange={(e) => {
              setFilterDays(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Comments List */}
        <div className="bg-[#111] border border-white/5 rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-white/5">
            <h3 className="text-lg leading-6 font-medium text-white">
              All Comments
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-white/30">
              View and manage all product comments
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Comment
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
                {comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="transition-colors duration-150 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {comment.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      <div>
                        <div className="font-medium">{comment.user_name}</div>
                        <div className="text-xs">{comment.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {comment.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {comment.store_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {comments.length === 0 && (
              <div className="text-center py-8 text-white/30">
                No comments found for the selected period.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-white/50">
              Showing {comments.length > 0 ? (currentPage - 1) * limit + 1 : 0}{" "}
              to {Math.min(currentPage * limit, totalComments)} of{" "}
              {totalComments} comments
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentPage === 1
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-gold-500 text-black hover:bg-gold-600"
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-white/50">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentPage === totalPages
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-gold-500 text-black hover:bg-gold-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
