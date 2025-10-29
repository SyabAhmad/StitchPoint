import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist, isInWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/collections")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Collections
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <FaShare size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={
                  product.image_url
                    ? `http://127.0.0.1:5000${product.image_url}`
                    : "/placeholder-image.jpg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedImage === i ? "ring-2 ring-yellow-500" : ""
                    }`}
                    style={{
                      opacity: selectedImage === i ? 1 : 0.7,
                    }}
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
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" size={20} />
                  ))}
                </div>
                <span className="text-lg text-gray-600 font-medium">
                  4.5 (24 reviews)
                </span>
              </div>

              {/* Price */}
              <div
                className="text-3xl font-bold text-gray-900 mb-6"
                style={{ color: "#d4af37" }}
              >
                ${product.price}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4 mb-6">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    product.stock_quantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {product.stock_quantity > 0 && (
                  <span className="text-gray-600">
                    {product.stock_quantity} available
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-8">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <FaMinus size={14} />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    inWishlist
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart size={20} />
                  <span>{inWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <FaTruck className="mx-auto mb-2 text-yellow-500" size={24} />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <FaShieldAlt
                    className="mx-auto mb-2 text-yellow-500"
                    size={24}
                  />
                  <p className="text-sm text-gray-600">2 Year Warranty</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <FaUndo className="mx-auto mb-2 text-yellow-500" size={24} />
                  <p className="text-sm text-gray-600">30 Day Returns</p>
                </div>
              </div>

              {/* Tabs: Description / Images / Reviews */}
              <div className="mt-6">
                <div className="flex space-x-3 border-b mb-6">
                  {[
                    { key: "description", label: "Description" },
                    { key: "images", label: "Images" },
                    { key: "reviews", label: "Reviews" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`px-4 py-2 -mb-px font-medium transition-colors duration-200 ${
                        activeTab === t.key
                          ? "border-b-2 border-yellow-500 text-yellow-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div>
                  {activeTab === "description" && (
                    <div className="prose text-gray-700">
                      <p>{product.description}</p>
                      {/* Show some product specs if available */}
                      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600">
                        {product.artisan_name && (
                          <div>
                            <dt className="font-medium">Artisan</dt>
                            <dd>{product.artisan_name}</dd>
                          </div>
                        )}
                        {product.materials && (
                          <div>
                            <dt className="font-medium">Materials</dt>
                            <dd>{product.materials}</dd>
                          </div>
                        )}
                        {product.dimensions && (
                          <div>
                            <dt className="font-medium">Dimensions</dt>
                            <dd>{product.dimensions}</dd>
                          </div>
                        )}
                        {product.weight && (
                          <div>
                            <dt className="font-medium">Weight</dt>
                            <dd>{product.weight}</dd>
                          </div>
                        )}
                        {product.care_instructions && (
                          <div>
                            <dt className="font-medium">Care</dt>
                            <dd>{product.care_instructions}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {activeTab === "images" && (
                    <div className="space-y-4">
                      <div className="w-full bg-white rounded-xl overflow-hidden shadow">
                        <img
                          src={
                            images[0]
                              ? `http://127.0.0.1:5000${images[0]}`
                              : "/placeholder-image.jpg"
                          }
                          alt={product.name}
                          className="w-full h-96 object-cover"
                        />
                      </div>
                      {images.length > 1 && (
                        <div className="flex gap-2">
                          {images.map((img, i) => (
                            <img
                              key={i}
                              src={`http://127.0.0.1:5000${img}`}
                              alt={`img-${i}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                      {images.length === 0 && (
                        <p className="text-gray-600">
                          No images available for this product.
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div>
                      {/* Review submission form */}
                      <form onSubmit={submitReview} className="mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                          <div className="flex items-center gap-4 mb-3">
                            <label className="text-sm font-medium text-gray-700">
                              Rating
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
                                e.currentTarget.style.backgroundColor =
                                  "#b8860b";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#d4af37";
                              }}
                            >
                              {submittingReview
                                ? "Submitting..."
                                : "Submit Review"}
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
                  )}
                </div>
              </div>

              {/* Store Info */}
              {product.store_name && (
                <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Store Information
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Store:</strong> {product.store_name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Category:</strong> {product.category || "General"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section - Now below product details */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
            <p className="text-gray-600">
              Comments are not supported yet. Coming soon.
            </p>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
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
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {rec.name}
                  </h3>
                  <p className="font-bold text-lg" style={{ color: "#d4af37" }}>
                    ${rec.price}
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
