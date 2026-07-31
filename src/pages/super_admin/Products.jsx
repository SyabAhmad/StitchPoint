import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const emptyProduct = { name: "", price: "", category: "", stock_quantity: "", description: "", district: "" };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, perPage, debouncedSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, per_page: perPage });
      if (debouncedSearch) params.append("search", debouncedSearch);
      const res = await fetchWithAuth(`http://localhost:5000/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / perPage));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyProduct);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      stock_quantity: product.stock_quantity ?? "",
      description: product.description || "",
      district: product.district || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
      };
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save product");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyProduct);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message);
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all";

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-7 w-7 border-2 border-gold-500/20 border-t-gold-500"></div>
          <span className="text-white/30 text-sm">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-xs text-white/30 mt-1">{totalItems} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all w-52"
          />
          <button onClick={openAddForm} className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:bg-gold-600 transition-colors whitespace-nowrap">
            <FaPlus className="text-[10px]" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{product.name}</td>
                  <td className="px-5 py-3 text-white/50">PKR {product.price?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-white/50">{product.category}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      product.stock_quantity > 10 ? "bg-emerald-500/15 text-emerald-400"
                        : product.stock_quantity > 0 ? "bg-amber-500/15 text-amber-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => openEditForm(product)} className="text-gold-500 hover:text-gold-600 text-xs font-medium mr-3 transition-colors">
                      <FaEdit className="inline mr-1" />Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-500 text-xs font-medium transition-colors">
                      <FaTrash className="inline mr-1" />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-10 text-white/30 text-sm">No products found.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/30">Per page:</label>
                <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-gold-500/40">
                  <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                </select>
              </div>
              <span className="text-xs text-white/30">{(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalItems)} of {totalItems}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className={`p-2 rounded transition-all ${currentPage === 1 ? "text-white/15 cursor-not-allowed" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                <FaChevronLeft className="text-xs" />
              </button>
              {getPageNumbers().map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`min-w-[28px] h-7 rounded text-xs font-medium transition-all ${page === currentPage ? "bg-gold-500 text-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className={`p-2 rounded transition-all ${currentPage === totalPages ? "text-white/15 cursor-not-allowed" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gold-500">{editingId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Name</label>
                <input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Product name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Price (PKR)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Stock</label>
                  <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData(p => ({ ...p, stock_quantity: e.target.value }))} className={inputClass} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Category</label>
                  <input value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className={inputClass} placeholder="Category" />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">District</label>
                  <input value={formData.district} onChange={(e) => setFormData(p => ({ ...p, district: e.target.value }))} className={inputClass} placeholder="District" />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className={inputClass} rows={3} placeholder="Description" />
              </div>
              <button onClick={handleSave} disabled={saving || !formData.name}
                className="w-full py-2.5 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
