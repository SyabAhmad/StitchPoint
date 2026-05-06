import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaTrash, FaEye, FaStar, FaReply } from "react-icons/fa";
import toast from "react-hot-toast";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:5000/api/dashboard/reviews/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error loading reviews");
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

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:5000/api/dashboard/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  const submitReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:5000/api/dashboard/reviews/${reviewId}/reply`,
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
        fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Error adding reply");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-white" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProduct =
        selectedProduct === "" ||
        review.product_id === parseInt(selectedProduct);

      return matchesSearch && matchesProduct;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
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
          <p className="text-gray-600">Loading reviews...</p>
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
                Reviews Management
              </h1>
              <p className="text-gray-600">
                View and manage all product reviews
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-black px-4 py-2 rounded-lg border border-white">
                <span className="text-white font-semibold">
                  {reviews.length}
                </span>
                <span className="text-white ml-1">TOTAL REVIEWS</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
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
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
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

        {/* Reviews List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedProduct
                  ? "Try adjusting your filters"
                  : "Reviews will appear here"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(review.user_name || "A")[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(review.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">{renderStars(review.rating)}</div>

                      {review.comment && (
                        <div className="mb-3">
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {review.comment}
                          </p>
                        </div>
                      )}

                      {/* Reply Display */}
                      {review.reply && (
                        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: "#e8f5e9", borderLeft: "3px solid #4caf50" }}>
                          <div className="flex items-center gap-2 mb-1">
                            <FaReply className="text-sm" style={{ color: "#4caf50" }} />
                            <span className="text-xs font-semibold" style={{ color: "#4caf50" }}>Manager Reply</span>
                            {review.replied_at && (
                              <span className="text-xs" style={{ color: "#888" }}>
                                ({new Date(review.replied_at).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">{review.reply}</p>
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === review.id ? (
                        <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: "#f5f5f5" }}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply to this review..."
                            className="w-full p-2 border rounded-lg text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => submitReply(review.id)}
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
                          onClick={() => navigate(`/product/${review.product_id}`)}
                          className="font-medium hover:underline flex items-center gap-1"
                        >
                          <FaEye className="text-xs" /> Product: {review.product_name || "Unknown Product"}
                        </button>
                        <span className="text-gray-400">•</span>
                        <span>Store: {review.store_name || "Unknown Store"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!review.reply && (
                        <button
                          onClick={() => { setReplyingTo(review.id); setReplyText(""); }}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                          title="Reply to Review"
                        >
                          <FaReply />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate(`/product/${review.product_id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        title="View Product"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Review"
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

export default Reviews;
