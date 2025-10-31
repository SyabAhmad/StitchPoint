import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaArrowLeft,
  FaShare,
  FaUser,
  FaThumbsUp,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHome,
  FaChevronRight,
} from "react-icons/fa";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist, isInWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";

const logAnalytics = async (productId, action, timeSpent = null) => {
  try {
    await fetch("http://127.0.0.1:5000/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        action,
        time_spent: timeSpent,
      }),
    });
  } catch (e) {
    console.error("Analytics log error", e);
  }
};

const ProductDetails = ({
  product: propProduct,
  onAddToCart: propOnAddToCart,
  onAddToWishlist: propOnAddToWishlist,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(propProduct || null);
  const [loading, setLoading] = useState(!propProduct);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [images, setImages] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    user_name: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    comment: "",
    user_name: "",
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchRecommendations = useCallback(async (prodId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/products/${prodId}/recommendations`
      );
      if (!res.ok) return;
      const d = await res.json();
      setRecommendations(d.recommendations || []);
    } catch (e) {
      console.error("Recommendations error", e);
    }
  }, []);

  const fetchReviews = useCallback(async (prodId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/products/${prodId}/reviews`
      );
      if (!res.ok) return;
      const d = await res.json();
      setReviews(d.reviews || []);
    } catch (e) {
      console.error("Fetch reviews error", e);
    }
  }, []);

  // Fetch product details from API
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data.product);
      setInWishlist(isInWishlist(data.product.id));

      // Build images array from product.image_url (and potential future image fields)
      const imgs = [];
      if (data.product.image_url) imgs.push(data.product.image_url);
      setImages(imgs);

      // Fetch recommendations from backend
      fetchRecommendations(data.product.id);
      // Fetch reviews from the dedicated endpoint to ensure fresh data
      fetchReviews(data.product.id);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id, fetchRecommendations, fetchReviews]);

  useEffect(() => {
    if (propProduct) {
      setProduct(propProduct);
      setInWishlist(isInWishlist(propProduct.id));
      // Build images array if propProduct provided
      const imgs = [];
      if (propProduct.image_url) imgs.push(propProduct.image_url);
      setImages(imgs);
      // Fetch recommendations for propProduct
      fetchRecommendations(propProduct.id);
      // Load reviews for propProduct
      fetchReviews(propProduct.id);
      setLoading(false);
    } else if (id) {
      fetchProduct();
    }
  }, [id, propProduct, fetchProduct, fetchRecommendations, fetchReviews]);

  // Separate effect for analytics logging - only when product is first loaded
  useEffect(() => {
    if (product && product.id) {
      logAnalytics(product.id, "view");
    }
  }, [product?.id]); // Only depend on product.id to avoid repeated calls

  const handleAddToCart = async () => {
    if (propOnAddToCart) {
      propOnAddToCart(product);
    } else {
      try {
        addToCart({ ...product, quantity });
        toast.success(`${product.name} added to cart!`);
      } catch {
        toast.error("Failed to add to cart");
      }
    }
  };

  const handleAddToWishlist = async () => {
    if (propOnAddToWishlist) {
      propOnAddToWishlist(product);
    } else {
      try {
        if (inWishlist) {
          // Remove from wishlist logic would go here
          setInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          addToWishlist(product);
          setInWishlist(true);
          toast.success(`${product.name} added to wishlist!`);
        }
      } catch {
        toast.error("Failed to update wishlist");
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!product || !product.id) return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    // Validate comment form
    const comment = (commentForm.comment || "").trim();
    const user_name = (
      commentForm.user_name ||
      (user && user.name) ||
      ""
    ).trim();

    if (!comment) {
      toast.error("Please enter a comment");
      return;
    }
    if (!token && !user_name) {
      toast.error("Please provide your name to post a comment");
      return;
    }

    setSubmittingComment(true); // New loading state
    try {
      const url = `http://127.0.0.1:5000/api/products/${product.id}/comments`;
      const body = { comment };
      if (!token) body.user_name = user_name;

      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit comment");
      }

      await res.json();
      toast.success("Comment submitted");
      // Clear form and refresh comments
      setCommentForm({ comment: "", user_name: "" });
      fetchComments(product.id);
    } catch (err) {
      console.error("Submit comment error", err);
      toast.error("Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const fetchComments = async (productId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/products/${productId}/comments`
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Fetch comments error", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!product || !product.id) return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    // Validate
    const rating = parseInt(reviewForm.rating, 10) || 0;
    const comment = (reviewForm.comment || "").trim();
    const user_name = (
      reviewForm.user_name ||
      (user && user.name) ||
      ""
    ).trim();

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }
    if (!comment) {
      toast.error("Please enter a comment");
      return;
    }
    if (!token && !user_name) {
      toast.error("Please provide your name to post a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const url = `http://127.0.0.1:5000/api/products/${product.id}/reviews`;
      const body = { rating, comment };
      if (!token) body.user_name = user_name;

      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit review");
      }

      await res.json();
      toast.success("Review submitted");
      // Clear form
      setReviewForm({ rating: 5, comment: "", user_name: "" });
      // Refresh reviews
      fetchReviews(product.id);
    } catch (err) {
      console.error("Submit review error", err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error: {error || "Product not found"}
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="px-6 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: "#d4af37",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b8860b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#d4af37";
            }}
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link
              to="/"
              className="flex items-center hover:text-gray-900 transition-colors"
            >
              <FaHome className="mr-1" />
              Home
            </Link>
            <FaChevronRight className="text-gray-400" />
            <Link
              to="/collections"
              className="hover:text-gray-900 transition-colors"
            >
              Collections
            </Link>
            <FaChevronRight className="text-gray-400" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/collections")}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg"
            >
              <FaArrowLeft className="mr-2" />
              Back to Collections
            </button>
            <div className="flex items-center space-x-3">
              <button className="text-gray-600 hover:text-gray-900 transition-all duration-300 p-2 rounded-full hover:bg-gray-50">
                <FaShare size={18} />
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`p-2 rounded-full transition-all duration-300 ${
                  inWishlist
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaHeart size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {/* Enhanced Product Images Gallery */}

          {/* Enhanced Product Details */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:space-x-10 gap-8 items-center justify-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                  </h1>

                  {/* Enhanced Rating */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" size={18} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">
                      4.5 (24 reviews)
                    </span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">Highly rated</span>
                  </div>

                  {/* Enhanced Price */}
                  <div className="mb-6">
                    <div
                      className="text-4xl font-bold mb-2"
                      style={{ color: "#d4af37" }}
                    >
                      PKR {product.price}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">
                        PKR 299.99
                      </span>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        Save 20%
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Stock Status */}
                  <div className="flex items-center space-x-4 mb-6">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        product.stock_quantity > 0
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          product.stock_quantity > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.stock_quantity > 0 && (
                      <span className="text-gray-600 text-sm font-medium">
                        {product.stock_quantity} available
                      </span>
                    )}
                  </div>

                  {/* Enhanced Quantity Selector */}
                  <div className="flex items-center space-x-4 mb-8">
                    <label className="text-gray-700 font-semibold">
                      Quantity:
                    </label>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        disabled={quantity <= 1}
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="px-6 py-3 text-lg font-semibold border-x border-gray-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        disabled={quantity >= product.stock_quantity}
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0}
                      className="flex-1 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor:
                          product.stock_quantity > 0 ? "#d4af37" : "#9ca3af",
                        color: "#000000",
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#b8860b";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock_quantity > 0) {
                          e.currentTarget.style.backgroundColor = "#d4af37";
                        }
                      }}
                    >
                      <FaShoppingCart size={20} />
                      <span className="text-lg">Add to Cart</span>
                    </button>

                    <button
                      onClick={handleAddToWishlist}
                      className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        inWishlist
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <FaHeart size={20} />
                      <span className="text-lg">
                        {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="space-y-6">
                    <div className="relative aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden group">
                      <img
                        src={
                          images[selectedImage]
                            ? `http://127.0.0.1:5000${images[selectedImage]}`
                            : product.image_url
                            ? `http://127.0.0.1:5000${product.image_url}`
                            : "/placeholder-image.jpg"
                        }
                        alt={product.name}
                        className="w-100 h-100 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {images.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                              selectedImage === i
                                ? "border-yellow-500 ring-4 ring-yellow-500/20 scale-110"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedImage(i)}
                          >
                            <img
                              src={`http://127.0.0.1:5000${img}`}
                              alt={`img-${i}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Zoom indicator */}
                    <div className="text-center">
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                        Click images to zoom • {images.length} image
                        {images.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Seller Info */}
              {product.store_name && (
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {product.store_name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className="text-yellow-500"
                              size={12}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          4.8 (1.2k reviews)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        2.5k products sold
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      <strong>Category:</strong> {product.category || "General"}
                    </span>
                    <button
                      onClick={() => navigate(`/store/${product.store_id}`)}
                      className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                    >
                      Visit Store
                    </button>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <FaTruck className="mx-auto mb-1 text-yellow-500" size={20} />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <FaShieldAlt
                    className="mx-auto mb-1 text-yellow-500"
                    size={20}
                  />
                  <p className="text-xs text-gray-600">2 Year Warranty</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <FaUndo className="mx-auto mb-1 text-yellow-500" size={20} />
                  <p className="text-xs text-gray-600">30 Day Returns</p>
                </div>
              </div>

              {/* Enhanced Tabs: Description / Specifications */}
              <div className="mt-8">
                <div className="flex space-x-1 border-b border-gray-200 mb-6">
                  {[
                    { key: "description", label: "Description" },
                    { key: "specifications", label: "Specifications" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-all duration-300 ${
                        activeTab === t.key
                          ? "bg-yellow-500 text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="bg-gray-50 rounded-2xl p-6 min-h-[200px]">
                  {activeTab === "description" && (
                    <div className="prose text-gray-700 max-w-none">
                      <p className="text-lg leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {activeTab === "specifications" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.artisan_name && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <dt className="font-semibold text-gray-900 mb-1">
                            Artisan
                          </dt>
                          <dd className="text-gray-600">
                            {product.artisan_name}
                          </dd>
                        </div>
                      )}
                      {product.materials && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <dt className="font-semibold text-gray-900 mb-1">
                            Materials
                          </dt>
                          <dd className="text-gray-600">{product.materials}</dd>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <dt className="font-semibold text-gray-900 mb-1">
                            Dimensions
                          </dt>
                          <dd className="text-gray-600">
                            {product.dimensions}
                          </dd>
                        </div>
                      )}
                      {product.weight && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <dt className="font-semibold text-gray-900 mb-1">
                            Weight
                          </dt>
                          <dd className="text-gray-600">{product.weight}</dd>
                        </div>
                      )}
                      {product.care_instructions && (
                        <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-2">
                          <dt className="font-semibold text-gray-900 mb-1">
                            Care Instructions
                          </dt>
                          <dd className="text-gray-600">
                            {product.care_instructions}
                          </dd>
                        </div>
                      )}
                      {!product.artisan_name &&
                        !product.materials &&
                        !product.dimensions &&
                        !product.weight &&
                        !product.care_instructions && (
                          <p className="text-gray-600 col-span-full text-center py-4">
                            No specifications available for this product.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Customer Reviews
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <form onSubmit={submitReview}>
                    <div className="mb-4">
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="text-gray-700 font-semibold">
                          Rating:
                        </label>
                        <select
                          value={reviewForm.rating}
                          onChange={(e) =>
                            setReviewForm((s) => ({
                              ...s,
                              rating: e.target.value,
                            }))
                          }
                          className="px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value={5}>5</option>
                          <option value={4}>4</option>
                          <option value={3}>3</option>
                          <option value={2}>2</option>
                          <option value={1}>1</option>
                        </select>
                        {!localStorage.getItem("token") && (
                          <input
                            type="text"
                            placeholder="Your name"
                            value={reviewForm.user_name}
                            onChange={(e) =>
                              setReviewForm((s) => ({
                                ...s,
                                user_name: e.target.value,
                              }))
                            }
                            className="ml-4 px-2 py-1 border border-gray-300 rounded flex-1"
                          />
                        )}
                      </div>
                      <textarea
                        placeholder="Write your review..."
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm((s) => ({
                            ...s,
                            comment: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                      />
                      <div className="text-right">
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-4 py-2 rounded-lg disabled:opacity-60 transition-all duration-200"
                          style={{
                            backgroundColor: "#d4af37",
                            color: "#000000",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#b8860b";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#d4af37";
                          }}
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {reviews.length === 0 ? (
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review this product.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white p-6 rounded-xl shadow-sm border"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                <FaUser className="text-white" size={16} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {review.user_name || "Anonymous"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {review.created_at
                                    ? new Date(
                                        review.created_at
                                      ).toLocaleDateString()
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="text-yellow-500"
                                  size={14}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Comments
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <form onSubmit={submitComment}>
                    <div className="mb-4">
                      {!localStorage.getItem("token") && (
                        <input
                          type="text"
                          placeholder="Your name"
                          value={commentForm.user_name}
                          onChange={(e) =>
                            setCommentForm((s) => ({
                              ...s,
                              user_name: e.target.value,
                            }))
                          }
                          className="mb-3 px-2 py-1 border border-gray-300 rounded w-full"
                        />
                      )}
                      <textarea
                        placeholder="Write your comment..."
                        value={commentForm.comment}
                        onChange={(e) =>
                          setCommentForm((s) => ({
                            ...s,
                            comment: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                      />
                      <div className="text-right">
                        <button
                          type="submit"
                          disabled={submittingComment}
                          className="px-4 py-2 rounded-lg disabled:opacity-60 transition-all duration-200"
                          style={{
                            backgroundColor: "#d4af37",
                            color: "#000000",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#b8860b";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#d4af37";
                          }}
                        >
                          {submittingComment ? "Submitting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Display comments */}
                  {comments.length === 0 ? (
                    <p className="text-gray-600">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <FaUser className="text-white" size={14} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {comment.user_name || "Anonymous"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {comment.created_at
                                    ? new Date(
                                        comment.created_at
                                      ).toLocaleDateString()
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate(`/product/${rec.id}`)}
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src={
                      rec.image_url
                        ? `http://127.0.0.1:5000${rec.image_url}`
                        : "/placeholder-image.jpg"
                    }
                    alt={rec.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {rec.name}
                  </h3>
                  <p
                    className="font-bold text-base"
                    style={{ color: "#d4af37" }}
                  >
                    PKR {rec.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
