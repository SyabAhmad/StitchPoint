import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AnalyticsAside from "../../components/AnalyticsAside";
import { makeAuthenticatedRequest } from "../../utils/auth";
import toast from "react-hot-toast";

const ManagerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category_id: "", district: "", stock_quantity: "",
    image_1: null, image_2: null, image_3: null,
    artisan_name: "", artisan_location: "", materials: "", dimensions: "", weight: "",
    care_instructions: "", is_featured: false,
    sale_type: "", sale_start_date: "", sale_end_date: "", sale_discount_percentage: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || userData.role !== "manager") { window.location.href = "/login"; return; }
    setUser(userData);
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = products;
    if (debouncedSearchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }
    if (selectedCategory) filtered = filtered.filter((p) => p.category_id === parseInt(selectedCategory));
    if (stockFilter) {
      if (stockFilter === "in-stock") filtered = filtered.filter((p) => p.stock_quantity > 0);
      else if (stockFilter === "low-stock") filtered = filtered.filter((p) => p.stock_quantity >= 1 && p.stock_quantity <= 10);
      else if (stockFilter === "out-of-stock") filtered = filtered.filter((p) => p.stock_quantity === 0);
    }
    if (minPrice) filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setCurrentPage(1);
  }, [products, debouncedSearchTerm, selectedCategory, stockFilter, minPrice, maxPrice]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const fetchProducts = async () => {
    try {
      const response = await makeAuthenticatedRequest("http://localhost:5000/api/products?page=1&per_page=10000");
      const data = await response.json();
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.role === "manager") {
        setProducts((data.products || []).filter((p) => p.store_name === userData.store_name));
      } else {
        setProducts(data.products || []);
      }
    } catch (error) { console.error("Error fetching products:", error); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) { console.error("Error fetching categories:", error); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") setFormData((prev) => ({ ...prev, [name]: files[0] }));
    else if (type === "checkbox") setFormData((prev) => ({ ...prev, [name]: checked }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => ({
    name: "", description: "", price: "", category_id: "", district: "", stock_quantity: "",
    image_1: null, image_2: null, image_3: null,
    artisan_name: user?.store_name || "", artisan_location: user?.store_address || "",
    materials: "", dimensions: "", weight: "", care_instructions: "", is_featured: false,
    sale_type: "", sale_start_date: "", sale_end_date: "", sale_discount_percentage: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const url = editingProduct ? `http://localhost:5000/api/products/${editingProduct.id}` : "http://localhost:5000/api/products";
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") formDataToSend.append(key, formData[key]);
      }
      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      if (response.ok) {
        fetchProducts();
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData(resetForm());
        toast.success(editingProduct ? "Product updated!" : "Product added!");
      } else {
        const errorText = await response.text();
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) { console.error("Error saving product:", error); toast.error("Error saving product"); }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "", description: product.description || "", price: product.price || "",
      category_id: product.category_id || "", stock_quantity: product.stock_quantity || 0,
      image_1: null, image_2: null, image_3: null,
      artisan_name: product.artisan_name || product.store_name || user?.store_name || "",
      artisan_location: product.artisan_location || product.store_address || user?.store_address || "",
      materials: product.materials || "", dimensions: product.dimensions || "", weight: product.weight || "",
      care_instructions: product.care_instructions || "", is_featured: product.is_featured || false,
      sale_type: product.sale_type || "",
      sale_start_date: product.sale_start_date ? new Date(product.sale_start_date).toISOString().slice(0, 16) : "",
      sale_end_date: product.sale_end_date ? new Date(product.sale_end_date).toISOString().slice(0, 16) : "",
      sale_discount_percentage: product.sale_discount_percentage || "", district: product.district || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) { fetchProducts(); toast.success("Product deleted!"); }
      else { toast.error("Error deleting product"); }
    } catch (error) { console.error("Error deleting product:", error); toast.error("Error deleting product"); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-3"></div>
          <span className="text-white/40 text-sm">Loading products...</span>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all";

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: "#D4AF37" }}>Products Management</h2>
          <button onClick={() => { setShowAddForm(true); setEditingProduct(null); setFormData(resetForm()); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: "#D4AF37", color: "#000000" }}>
            <FaPlus size={12} /> Add Product
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => { setShowAddForm(false); setEditingProduct(null); }}>
            <div className="bg-[#111] border border-white/5 rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-semibold text-gold-500">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => { setShowAddForm(false); setEditingProduct(null); }} className="text-white/30 hover:text-white transition-colors"><FaTimes size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Product Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} required /></div>
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Price *</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" className={inputClass} required /></div>
                </div>
                <div>
                  <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Category *</label>
                  <select name="category_id" value={formData.category_id} onChange={handleInputChange} className={inputClass} required>
                    <option value="" className="bg-[#111]">Select a category</option>
                    {categories.map((c) => (<option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Stock Quantity *</label><input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className={inputClass} required /></div>
                  <div>
                    <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">District/Area</label>
                    <select name="district" value={formData.district} onChange={handleInputChange} className={inputClass}>
                      <option value="" className="bg-[#111]">Select District</option>
                      {["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta","Sialkot","Gujranwala","Bahawalpur","Sargodha","Jhang","Sheikhupura","Abbottabad","Sukkur","Hyderabad","Larkana","Nawabshah","Mirpur Khas","Jacobabad","Shikarpur","Khairpur","Dadu","Other"].map((d) => (
                        <option key={d} value={d} className="bg-[#111]">{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Image 1 (Required) *</label>
                  {editingProduct && editingProduct.image_url && (
                    <div className="mb-2">
                      <p className="text-xs text-white/30 mb-1">Current: {editingProduct.image_url.split("/").pop()}</p>
                      <img src={`http://localhost:5000${editingProduct.image_url}`} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                    </div>
                  )}
                  <input type="file" name="image_1" onChange={handleInputChange} accept="image/*" className={inputClass} required={!editingProduct} />
                  {editingProduct && <p className="text-[10px] text-white/20 mt-1">Leave empty to keep current image</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Image 2 (Optional)</label><input type="file" name="image_2" onChange={handleInputChange} accept="image/*" className={inputClass} /></div>
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Image 3 (Optional)</label><input type="file" name="image_3" onChange={handleInputChange} accept="image/*" className={inputClass} /></div>
                </div>
                <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClass} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Artisan Location</label><input type="text" name="artisan_location" value={formData.artisan_location} onChange={handleInputChange} className={inputClass} /></div>
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Materials</label><input type="text" name="materials" value={formData.materials} onChange={handleInputChange} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Dimensions</label><input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} placeholder="e.g., 10x5x2 cm" className={inputClass} /></div>
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Weight</label><input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g., 500g" className={inputClass} /></div>
                  <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Care Instructions</label><input type="text" name="care_instructions" value={formData.care_instructions} onChange={handleInputChange} placeholder="e.g., Hand wash only" className={inputClass} /></div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="w-4 h-4 rounded accent-gold-500" />
                  <label className="text-sm text-white/60">Mark as Featured Product</label>
                  <span className="text-[10px] text-white/20">(Will appear in homepage featured section)</span>
                </div>
                {/* Sale Section */}
                <div className="p-4 bg-white/[0.03] rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium text-gold-500 mb-4">Special Sale Information (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Sale Type</label>
                      <select name="sale_type" value={formData.sale_type} onChange={handleInputChange} className={inputClass}>
                        <option value="" className="bg-[#111]">No Sale</option>
                        {["EID","Friday","Christmas","New Year","Ramadan","Independence Day","Custom"].map((s) => (
                          <option key={s} value={s} className="bg-[#111]">{s} Sale</option>
                        ))}
                      </select>
                    </div>
                    <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Discount %</label><input type="number" name="sale_discount_percentage" value={formData.sale_discount_percentage} onChange={handleInputChange} min="0" max="100" step="0.1" placeholder="e.g., 15.5" className={inputClass} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Sale Start Date</label><input type="datetime-local" name="sale_start_date" value={formData.sale_start_date} onChange={handleInputChange} className={inputClass} /></div>
                    <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Sale End Date</label><input type="datetime-local" name="sale_end_date" value={formData.sale_end_date} onChange={handleInputChange} className={inputClass} /></div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowAddForm(false); setEditingProduct(null); }} className="px-4 py-2 bg-white/5 text-white/60 text-sm rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gold-500 text-black text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors">{editingProduct ? "Update" : "Add"} Product</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#111] border border-white/5 rounded-lg p-5 mb-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#D4AF37" }}>Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Search</label><input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputClass} /></div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputClass}>
                <option value="" className="bg-[#111]">All Categories</option>
                {categories.map((c) => (<option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Stock Status</label>
              <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className={inputClass}>
                <option value="" className="bg-[#111]">All Stock</option>
                <option value="in-stock" className="bg-[#111]">In Stock (&gt;0)</option>
                <option value="low-stock" className="bg-[#111]">Low Stock (1-10)</option>
                <option value="out-of-stock" className="bg-[#111]">Out of Stock (0)</option>
              </select>
            </div>
            <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Min Price</label><input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} step="0.01" className={inputClass} /></div>
            <div><label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Max Price</label><input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} step="0.01" className={inputClass} /></div>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => { setSearchTerm(""); setSelectedCategory(""); setStockFilter(""); setMinPrice(""); setMaxPrice(""); setCurrentPage(1); }}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{ backgroundColor: "#2d2d2d", color: "#cccccc" }}>Clear Filters</button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Manage Products</h3>
            <p className="text-[11px] text-white/30 mt-0.5">View and manage all products</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Name","Price","Category","Stock","Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-gold-500 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</td>
                    <td className="px-5 py-3 text-white/60">PKR {product.price}</td>
                    <td className="px-5 py-3 text-white/60">{categories.find((c) => c.id === product.category_id)?.name || "Unknown"}</td>
                    <td className="px-5 py-3 text-white/60">{product.stock_quantity}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(product)} className="text-gold-500 hover:text-gold-600 text-xs font-medium transition-colors"><FaEdit className="inline mr-1" size={11} />Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-500 text-xs font-medium transition-colors"><FaTrash className="inline mr-1" size={11} />Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div className="text-center py-8 text-white/30 text-sm">No products found. Add your first product to get started.</div>}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-5 gap-1">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === i + 1 ? "bg-gold-500 text-black font-semibold" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        )}
      </div>
      <AnalyticsAside userRole="manager" />
    </div>
  );
};

export default ManagerProducts;
