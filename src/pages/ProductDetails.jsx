import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaShare, FaUser,
  FaMinus, FaPlus, FaTruck, FaShieldAlt, FaUndo, FaHome, FaChevronRight,
} from "react-icons/fa";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist, isInWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const logAnalytics = async (productId, action, timeSpent = null) => {
  try {
    await fetch(`${API_BASE}/api/analytics/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, action, time_spent: timeSpent }),
    });
  } catch (e) { console.error("Analytics log error", e); }
};

const ProductDetails = ({ product: propProduct, onAddToCart: propOnAddToCart, onAddToWishlist: propOnAddToWishlist }) => {
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
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", user_name: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ comment: "", user_name: "" });
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchRecommendations = useCallback(async (prodId) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${prodId}/recommendations`);
      if (!res.ok) return;
      const d = await res.json();
      setRecommendations(d.recommendations || []);
    } catch (e) { console.error("Recommendations error", e); }
  }, []);

  const fetchReviews = useCallback(async (prodId) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${prodId}/reviews`);
      if (!res.ok) return;
      const d = await res.json();
      setReviews(d.reviews || []);
    } catch (e) { console.error("Fetch reviews error", e); }
  }, []);

  const fetchComments = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}/comments`);
      if (res.ok) { const data = await res.json(); setComments(data.comments || []); }
    } catch (err) { console.error("Fetch comments error", err); }
  };

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data.product);
      setInWishlist(isInWishlist(data.product.id));
      const imgs = [];
      if (data.product.image_url) imgs.push(data.product.image_url);
      setImages(imgs);
      fetchRecommendations(data.product.id);
      fetchReviews(data.product.id);
      fetchComments(data.product.id);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load product");
    } finally { setLoading(false); }
  }, [id, fetchRecommendations, fetchReviews]);

  useEffect(() => {
    if (propProduct) {
      setProduct(propProduct);
      setInWishlist(isInWishlist(propProduct.id));
      const imgs = [];
      if (propProduct.image_url) imgs.push(propProduct.image_url);
      setImages(imgs);
      fetchRecommendations(propProduct.id);
      fetchReviews(propProduct.id);
      fetchComments(propProduct.id);
      setLoading(false);
    } else if (id) { fetchProduct(); }
  }, [id, propProduct, fetchProduct, fetchRecommendations, fetchReviews]);

  useEffect(() => {
    if (product && product.id) logAnalytics(product.id, "view");
  }, [product?.id]);

  const handleAddToCart = async () => {
    if (propOnAddToCart) { propOnAddToCart(product); }
    else {
      try { await addToCart(product, quantity); toast.success(`${product.name} added to cart!`); }
      catch { toast.error("Failed to add to cart"); }
    }
  };

  const handleAddToWishlist = async () => {
    if (propOnAddToWishlist) { propOnAddToWishlist(product); }
    else {
      try {
        if (inWishlist) { setInWishlist(false); toast.success("Removed from wishlist"); }
        else { addToWishlist(product); setInWishlist(true); toast.success(`${product.name} added to wishlist!`); }
      } catch { toast.error("Failed to update wishlist"); }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!product || !product.id) return;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const comment = (commentForm.comment || "").trim();
    const user_name = (commentForm.user_name || (user && user.name) || "").trim();
    if (!comment) { toast.error("Please enter a comment"); return; }
    if (!token && !user_name) { toast.error("Please provide your name"); return; }
    setSubmittingComment(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const body = { comment };
      if (!token) body.user_name = user_name;
      const res = await fetch(`${API_BASE}/api/products/${product.id}/comments`, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Failed to submit comment");
      toast.success("Comment submitted");
      setCommentForm({ comment: "", user_name: "" });
      fetchComments(product.id);
    } catch (err) { console.error("Submit comment error", err); toast.error("Failed to submit comment"); }
    finally { setSubmittingComment(false); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!product || !product.id) return;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const rating = parseInt(reviewForm.rating, 10) || 0;
    const comment = (reviewForm.comment || "").trim();
    const user_name = (reviewForm.user_name || (user && user.name) || "").trim();
    if (rating < 1 || rating > 5) { toast.error("Rating must be between 1 and 5"); return; }
    if (!comment) { toast.error("Please enter a comment"); return; }
    if (!token && !user_name) { toast.error("Please provide your name"); return; }
    setSubmittingReview(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const body = { rating, comment };
      if (!token) body.user_name = user_name;
      const res = await fetch(`${API_BASE}/api/products/${product.id}/reviews`, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Failed to submit review");
      toast.success("Review submitted");
      setReviewForm({ rating: 5, comment: "", user_name: "" });
      fetchReviews(product.id);
      fetchProduct();
    } catch (err) { console.error("Submit review error", err); toast.error("Failed to submit review"); }
    finally { setSubmittingReview(false); }
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500"></div>
          <span className="text-white/30 text-sm">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Product not found"}</p>
          <button onClick={() => navigate("/collections")} className="px-6 py-2 bg-gold-500 text-black rounded-lg text-sm font-semibold hover:bg-gold-600 transition-colors">
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.sale_type && product.sale_discount_percentage
    ? (product.price * (1 - product.sale_discount_percentage / 100)).toFixed(2)
    : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-white/30">
            <Link to="/" className="flex items-center gap-1 hover:text-white/60 transition-colors"><FaHome /> Home</Link>
            <FaChevronRight className="text-[8px]" />
            <Link to="/collections" className="hover:text-white/60 transition-colors">Collections</Link>
            <FaChevronRight className="text-[8px]" />
            <span className="text-white/60 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Top bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/collections")} className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors">
            <FaArrowLeft /> Back to Collections
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/30 hover:text-white/60 rounded-lg hover:bg-white/5 transition-colors"><FaShare size={14} /></button>
            <button onClick={handleAddToWishlist} className={`p-2 rounded-lg transition-colors ${inWishlist ? "text-red-400 bg-red-500/10" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
              <FaHeart size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#111] border border-white/5 rounded-xl overflow-hidden">
              <img
                src={images[selectedImage] ? `${API_BASE}${images[selectedImage]}` : product.image_url ? `${API_BASE}${product.image_url}` : "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <div key={i} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border transition-all ${selectedImage === i ? "border-gold-500" : "border-white/10 hover:border-white/20"}`}
                    onClick={() => setSelectedImage(i)}>
                    <img src={`${API_BASE}${img}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.average_rating || 0) ? "text-gold-500" : "text-white/10"} size={13} />
                  ))}
                </div>
                <span className="text-white/40">{product.average_rating ? `${product.average_rating}` : "No rating"} ({reviews.length} reviews)</span>
                <span className="text-white/15">|</span>
                <span className="text-white/30">{product.category || "General"}</span>
              </div>
            </div>

            {/* Price */}
            <div>
              {discountedPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gold-500">PKR {discountedPrice}</span>
                  <span className="text-lg text-white/30 line-through">PKR {product.price}</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{product.sale_discount_percentage}% OFF</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gold-500">PKR {product.price}</span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3 text-sm">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock_quantity > 0 ? "bg-emerald-400" : "bg-red-400"}`}></span>
                {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {product.stock_quantity > 0 && <span className="text-white/30">{product.stock_quantity} available</span>}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-white/40 hover:text-white hover:bg-white/5 transition-colors" disabled={quantity <= 1}>
                  <FaMinus size={12} />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-white min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-white/40 hover:text-white hover:bg-white/5 transition-colors" disabled={quantity >= product.stock_quantity}>
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={handleAddToCart} disabled={product.stock_quantity === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-black text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <FaShoppingCart size={16} /> Add to Cart
              </button>
              <button onClick={handleAddToWishlist}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${inWishlist ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"}`}>
                <FaHeart size={16} /> {inWishlist ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: FaTruck, label: "Free Shipping" },
                { icon: FaShieldAlt, label: "2 Year Warranty" },
                { icon: FaUndo, label: "30 Day Returns" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                  <f.icon className="text-gold-500/60" size={16} />
                  <span className="text-[11px] text-white/30 text-center">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Store info */}
            {product.store_name && (
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gold-500/10 rounded-full flex items-center justify-center overflow-hidden">
                    {product.store_logo_url ? (
                      <img src={`${API_BASE}${product.store_logo_url}`} alt="" className="w-full h-full object-cover" />
                    ) : <FaUser className="text-gold-500" size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{product.store_name}</p>
                    <p className="text-[11px] text-white/30">{product.store_products_sold || 0} products sold</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/store/${product.store_id}`)} className="text-xs text-gold-500 hover:text-gold-600 transition-colors">Visit Store</button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="flex gap-1 border-b border-white/5 mb-5">
            {[{ key: "description", label: "Description" }, { key: "specifications", label: "Specifications" }].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === t.key ? "text-gold-500 border-b-2 border-gold-500" : "text-white/30 hover:text-white/60"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="bg-[#111] border border-white/5 rounded-xl p-6">
            {activeTab === "description" && (
              <p className="text-sm text-white/50 leading-relaxed">{product.description || "No description available."}</p>
            )}
            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  product.artisan_name && { label: "Artisan", value: product.artisan_name },
                  product.materials && { label: "Materials", value: product.materials },
                  product.dimensions && { label: "Dimensions", value: product.dimensions },
                  product.weight && { label: "Weight", value: product.weight },
                  product.care_instructions && { label: "Care", value: product.care_instructions },
                ].filter(Boolean).length > 0 ? (
                  [product.artisan_name && { label: "Artisan", value: product.artisan_name },
                   product.materials && { label: "Materials", value: product.materials },
                   product.dimensions && { label: "Dimensions", value: product.dimensions },
                   product.weight && { label: "Weight", value: product.weight },
                   product.care_instructions && { label: "Care", value: product.care_instructions },
                  ].filter(Boolean).map((s) => (
                    <div key={s.label} className="bg-white/[0.03] p-3 rounded-lg">
                      <p className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5">{s.label}</p>
                      <p className="text-sm text-white/60">{s.value}</p>
                    </div>
                  ))
                ) : <p className="text-sm text-white/20 text-center py-6">No specifications available.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-white mb-4">Reviews</h3>
          <div className="bg-[#111] border border-white/5 rounded-xl p-5">
            <form onSubmit={submitReview} className="mb-6 pb-6 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <select value={reviewForm.rating} onChange={(e) => setReviewForm((s) => ({ ...s, rating: e.target.value }))}
                  className="px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40">
                  <option value={5} className="bg-black">5 Stars</option>
                  <option value={4} className="bg-black">4 Stars</option>
                  <option value={3} className="bg-black">3 Stars</option>
                  <option value={2} className="bg-black">2 Stars</option>
                  <option value={1} className="bg-black">1 Star</option>
                </select>
                {!localStorage.getItem("token") && (
                  <input type="text" placeholder="Your name" value={reviewForm.user_name}
                    onChange={(e) => setReviewForm((s) => ({ ...s, user_name: e.target.value }))} className={inputClass} />
                )}
              </div>
              <textarea placeholder="Write your review..." value={reviewForm.comment}
                onChange={(e) => setReviewForm((s) => ({ ...s, comment: e.target.value }))} className={`${inputClass} mb-3`} rows={3} />
              <div className="text-right">
                <button type="submit" disabled={submittingReview}
                  className="px-4 py-2 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>

            {reviews.length === 0 ? (
              <p className="text-sm text-white/20 text-center py-4">No reviews yet. Be the first to review this product.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gold-500/10 rounded-full flex items-center justify-center">
                          <FaUser className="text-gold-500" size={11} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{review.user_name || "Anonymous"}</p>
                          <p className="text-[10px] text-white/20">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => <FaStar key={i} className="text-gold-500" size={11} />)}
                      </div>
                    </div>
                    <p className="text-sm text-white/50">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-white mb-4">Comments</h3>
          <div className="bg-[#111] border border-white/5 rounded-xl p-5">
            <form onSubmit={submitComment} className="mb-6 pb-6 border-b border-white/5">
              {!localStorage.getItem("token") && (
                <input type="text" placeholder="Your name" value={commentForm.user_name}
                  onChange={(e) => setCommentForm((s) => ({ ...s, user_name: e.target.value }))} className={`${inputClass} mb-3`} />
              )}
              <textarea placeholder="Write your comment..." value={commentForm.comment}
                onChange={(e) => setCommentForm((s) => ({ ...s, comment: e.target.value }))} className={`${inputClass} mb-3`} rows={3} />
              <div className="text-right">
                <button type="submit" disabled={submittingComment}
                  className="px-4 py-2 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40">
                  {submittingComment ? "Submitting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {comments.length === 0 ? (
              <p className="text-sm text-white/20 text-center py-4">No comments yet.</p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gold-500/10 rounded-full flex items-center justify-center">
                        <FaUser className="text-gold-500" size={10} />
                      </div>
                      <p className="text-sm font-medium text-white">{comment.user_name || "Anonymous"}</p>
                      <span className="text-[10px] text-white/15">{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="text-sm text-white/50">{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recommendations.map((rec) => (
                <div key={rec.id} onClick={() => navigate(`/product/${rec.id}`)}
                  className="bg-[#111] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-white/10 transition-all">
                  <div className="aspect-square bg-white/[0.02]">
                    <img src={rec.image_url ? `${API_BASE}${rec.image_url}` : "/placeholder-image.jpg"} alt={rec.name}
                      className="w-full h-full object-cover" onError={(e) => { e.target.src = "/placeholder-image.jpg"; }} />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-white font-medium truncate">{rec.name}</p>
                    {rec.sale_type && rec.sale_discount_percentage ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-gold-500">PKR {(rec.price * (1 - rec.sale_discount_percentage / 100)).toFixed(0)}</span>
                        <span className="text-[10px] text-white/20 line-through">PKR {rec.price}</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-gold-500 mt-1">PKR {rec.price}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
