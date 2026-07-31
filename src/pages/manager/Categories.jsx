import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const ManagerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "", parent_id: "" });

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => { fetchCategories(searchTerm); }, [searchTerm]);

  const fetchCategories = async (search = "") => {
    try {
      const token = localStorage.getItem("token");
      const url = search
        ? `http://localhost:5000/api/categories?search=${encodeURIComponent(search)}`
        : "http://localhost:5000/api/categories";
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setCategories(data.categories || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const url = editingCategory
        ? `http://localhost:5000/api/categories/${editingCategory.id}`
        : "http://localhost:5000/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchCategories();
        setShowAddForm(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", parent_id: "" });
        toast.success(editingCategory ? "Category updated!" : "Category added!");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error saving category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || "", parent_id: category.parent_id || "" });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchCategories();
        toast.success("Category deleted!");
      } else {
        toast.error("Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-3"></div>
          <span className="text-white/40 text-sm">Loading categories...</span>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#D4AF37" }}>Categories Management</h2>
        <button
          onClick={() => { setShowAddForm(true); setEditingCategory(null); setFormData({ name: "", description: "", parent_id: "" }); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#D4AF37", color: "#000000" }}
        >
          <FaPlus size={12} /> Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-6 bg-[#111] border border-white/5 rounded-lg">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#D4AF37" }}>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Category Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Parent Category</label>
              <select name="parent_id" value={formData.parent_id} onChange={handleInputChange} className={inputClass}>
                <option value="" className="bg-[#111]">None (Top Level)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-[#111]">{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowAddForm(false); setEditingCategory(null); setFormData({ name: "", description: "", parent_id: "" }); }}
                className="px-4 py-2 bg-white/5 text-white/60 text-sm rounded-lg hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors" style={{ backgroundColor: "#D4AF37", color: "#000000" }}>
                {editingCategory ? "Update" : "Add"} Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Manage Categories</h3>
            <p className="text-[11px] text-white/30 mt-0.5">View and manage all categories</p>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
            <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 w-48" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{category.name}</td>
                  <td className="px-5 py-3 text-white/50">{category.description || "No description"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(category)} className="text-xs font-medium transition-colors" style={{ color: "#D4AF37" }}>
                        <FaEdit className="inline mr-1" size={11} />Edit
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="text-red-400 hover:text-red-500 text-xs font-medium transition-colors">
                        <FaTrash className="inline mr-1" size={11} />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="text-center py-8 text-white/30 text-sm">No categories found. Add your first category to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerCategories;
