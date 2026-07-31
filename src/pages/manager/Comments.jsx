import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash, FaEye, FaComment } from "react-icons/fa";
import toast from "react-hot-toast";

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);

  useEffect(() => { fetchComments(); fetchProducts(); }, []);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/api/comments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) { const data = await response.json(); setComments(data.comments || []); }
      else { toast.error("Failed to fetch comments"); }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Error loading comments");
    } finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/products?page=1&per_page=1000");
      if (response.ok) { const data = await response.json(); setProducts(data.products || []); }
    } catch (error) { console.error("Error fetching products:", error); }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/api/comments/${commentId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) { toast.success("Comment deleted successfully"); fetchComments(); }
      else { toast.error("Failed to delete comment"); }
    } catch (error) { console.error("Error deleting comment:", error); toast.error("Error deleting comment"); }
  };

  const filteredComments = comments
    .filter((comment) => {
      const matchesSearch = comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProduct = selectedProduct === "" || comment.product_id === parseInt(selectedProduct);
      return matchesSearch && matchesProduct;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at) - new Date(a.created_at);
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "product": return (a.product_name || "").localeCompare(b.product_name || "");
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-3"></div>
          <span className="text-white/40 text-sm">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[#111] border border-white/5 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gold-500">Comments Management</h2>
            <p className="text-white/40 text-sm mt-1">View and manage all product comments</p>
          </div>
          <div className="px-3 py-1.5 bg-gold-500/10 rounded-lg">
            <span className="text-gold-500 font-semibold text-sm">{comments.length}</span>
            <span className="text-white/40 text-sm ml-1">Total</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
            <input type="text" placeholder="Search comments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40" />
          </div>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40">
            <option value="" className="bg-[#111]">All Products</option>
            {products.map((product) => (<option key={product.id} value={product.id} className="bg-[#111]">{product.name}</option>))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40">
            <option value="newest" className="bg-[#111]">Newest First</option>
            <option value="oldest" className="bg-[#111]">Oldest First</option>
            <option value="product" className="bg-[#111]">By Product</option>
          </select>
          <button onClick={() => { setSearchTerm(""); setSelectedProduct(""); setSortBy("newest"); }}
            className="px-3 py-2 bg-white/5 text-white/40 rounded-lg hover:bg-white/10 hover:text-white/60 transition-colors text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <FaComment className="mx-auto h-8 w-8 text-white/15 mb-3" />
            <p className="text-white/40 text-sm">No comments found</p>
            <p className="text-white/20 text-xs mt-1">{searchTerm || selectedProduct ? "Try adjusting your filters" : "Comments will appear here"}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gold-500/10 rounded-full flex items-center justify-center">
                        <span className="text-gold-500 font-semibold text-xs">
                          {(comment.user_name || "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{comment.user_name || "Anonymous"}</p>
                        <p className="text-[11px] text-white/30">
                          {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 ml-11">
                      <p className="text-sm text-white/60 bg-white/[0.03] p-3 rounded-lg">{comment.comment}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/30 ml-11">
                      <span>Product: <span className="text-white/50">{comment.product_name || "Unknown"}</span></span>
                      <span>&bull;</span>
                      <span>Store: <span className="text-white/50">{comment.store_name || "Unknown"}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button onClick={() => navigate(`/product/${comment.product_id}`)}
                      className="p-2 text-white/20 hover:text-gold-500 rounded-lg hover:bg-white/5 transition-colors" title="View Product">
                      <FaEye size={14} />
                    </button>
                    <button onClick={() => deleteComment(comment.id)}
                      className="p-2 text-white/20 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors" title="Delete Comment">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
