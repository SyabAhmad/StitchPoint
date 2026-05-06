import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaTrash, FaEye, FaComment, FaReply } from "react-icons/fa";
import toast from "react-hot-toast";

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchComments();
    fetchProducts();
  }, []);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/api/comments/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        toast.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Error loading comments");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/products?page=1&per_page=1000"
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Comment deleted successfully");
        fetchComments();
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  const submitReply = async (commentId) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:5000/api/dashboard/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reply: replyText }),
        }
      );

      if (response.ok) {
        toast.success("Reply added successfully");
        setReplyingTo(null);
        setReplyText("");
        fetchComments();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Error adding reply");
    }
  };

  const filteredComments = comments
    .filter((comment) => {
      const matchesSearch =
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.product_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProduct =
        selectedProduct === "" ||
        comment.product_id === parseInt(selectedProduct);

      return matchesSearch && matchesProduct;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "product":
          return (a.product_name || "").localeCompare(b.product_name || "");
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Comments Management
              </h1>
              <p className="text-gray-600">
                View and manage all product comments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-black px-4 py-2 rounded-lg border border-white">
                <span className="text-white font-semibold">
                  {comments.length}
                </span>
                <span className="text-white ml-1">TOTAL COMMENTS</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="product">By Product</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedProduct("");
                setSortBy("newest");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <FaComment className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No comments found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedProduct
                  ? "Try adjusting your filters"
                  : "Comments will appear here"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(comment.user_name || "A")[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {comment.user_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(comment.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {comment.comment}
                        </p>
                      </div>

                      {/* Reply Display */}
                      {comment.reply && (
                        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: "#e8f5e9", borderLeft: "3px solid #4caf50" }}>
                          <div className="flex items-center gap-2 mb-1">
                            <FaReply className="text-sm" style={{ color: "#4caf50" }} />
                            <span className="text-xs font-semibold" style={{ color: "#4caf50" }}>Manager Reply</span>
                            {comment.replied_at && (
                              <span className="text-xs" style={{ color: "#888" }}>
                                ({new Date(comment.replied_at).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">{comment.reply}</p>
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === comment.id ? (
                        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: "#f5f5f5" }}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply to this comment..."
                            className="w-full p-2 border rounded-lg text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => submitReply(comment.id)}
                              className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                            >
                              Submit Reply
                            </button>
                            <button
                              onClick={() => { setReplyingTo(null); setReplyText(""); }}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <button
                          onClick={() => navigate(`/product/${comment.product_id}`)}
                          className="font-medium hover:underline flex items-center gap-1"
                        >
                          <FaEye className="text-xs" /> Product: {comment.product_name || "Unknown Product"}
                        </button>
                        <span className="text-gray-400">•</span>
                        <span>Store: {comment.store_name || "Unknown Store"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!comment.reply && (
                        <button
                          onClick={() => { setReplyingTo(comment.id); setReplyText(""); }}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                          title="Reply to Comment"
                        >
                          <FaReply />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate(`/product/${comment.product_id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        title="View Product"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Comment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
