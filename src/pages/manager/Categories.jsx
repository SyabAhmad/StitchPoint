import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManagerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCategories();
        setShowAddForm(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        alert(editingCategory ? "Category updated!" : "Category added!");
      } else {
        alert("Error saving category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchCategories();
        alert("Category deleted!");
      } else {
        alert("Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#d4af37" }}>
          Categories Management
        </h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingCategory(null);
            setFormData({ name: "", description: "" });
          }}
          className="flex items-center px-4 py-2 rounded-md transition-all duration-200"
          style={{
            backgroundColor: "#d4af37",
            color: "#000000",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b8860b";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#d4af37";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <FaPlus className="mr-2" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div
          className="mb-6 p-6 rounded-lg"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: "#d4af37" }}>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#d4af37";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#d4af37";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCategory(null);
                  setFormData({ name: "", description: "" });
                }}
                className="px-4 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#555555",
                  color: "#ffffff",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded transition-all duration-200"
                style={{
                  backgroundColor: "#d4af37",
                  color: "#000000",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b8860b";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#d4af37";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {editingCategory ? "Update" : "Add"} Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className="shadow overflow-hidden sm:rounded-md"
        style={{ backgroundColor: "#1d1d1d" }}
      >
        <div
          className="px-4 py-5 sm:px-6 border-b"
          style={{ borderColor: "#2d2d2d" }}
        >
          <h3
            className="text-lg leading-6 font-medium"
            style={{ color: "#ffffff" }}
          >
            Manage Categories
          </h3>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
            View and manage all categories
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: "#2d2d2d" }}>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#d4af37" }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#d4af37" }}
                >
                  Description
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#d4af37" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "#1d1d1d" }}>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="transition-colors duration-150"
                  style={{
                    borderBottom: "1px solid #2d2d2d",
                    backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f1f1f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                  }}
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                    style={{ color: "#ffffff" }}
                  >
                    {category.name}
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#cccccc" }}
                  >
                    {category.description || "No description"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="mr-4 transition-colors duration-200"
                      style={{ color: "#d4af37" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#b8860b";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#d4af37";
                      }}
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="transition-colors duration-200"
                      style={{ color: "#e53e3e" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#c53030";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#e53e3e";
                      }}
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="text-center py-8" style={{ color: "#999999" }}>
              No categories found. Add your first category to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerCategories;
