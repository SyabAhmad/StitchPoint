import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AnalyticsAside from "../../components/AnalyticsAside";
import { makeAuthenticatedRequest } from "../../utils/auth";

const ManagerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "",
    image_1: null,
    image_2: null,
    image_3: null,
    artisan_name: "",
    artisan_location: "",
    materials: "",
    dimensions: "",
    weight: "",
    care_instructions: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page

  // Filter states (temporary inputs)
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
    if (!userData || userData.role !== "manager") {
      window.location.href = "/login";
      return;
    }
    setUser(userData);
    fetchProducts(); // Fetch all products for client-side filtering
    fetchCategories();
  }, []);

  // Debounce search term to prevent excessive filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Apply filters whenever products or filter states change
  useEffect(() => {
    let filtered = products;

    // Search by name or description
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id === parseInt(selectedCategory)
      );
    }

    // Filter by stock status
    if (stockFilter) {
      if (stockFilter === "in-stock") {
        filtered = filtered.filter((product) => product.stock_quantity > 0);
      } else if (stockFilter === "low-stock") {
        filtered = filtered.filter(
          (product) =>
            product.stock_quantity >= 1 && product.stock_quantity <= 10
        );
      } else if (stockFilter === "out-of-stock") {
        filtered = filtered.filter((product) => product.stock_quantity === 0);
      }
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    products,
    debouncedSearchTerm,
    selectedCategory,
    stockFilter,
    minPrice,
    maxPrice,
  ]);

  // Pagination logic (client-side)
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const fetchProducts = async (page = 1, perPage = 10, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...filters,
      });

      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/products?${queryParams.toString()}`
      );
      const data = await response.json();

      // Filter products to only show those from the manager's store (client-side after server fetch)
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.role === "manager") {
        const storeProducts = data.products.filter(
          (product) => product.store_name === userData.store_name
        );
        setProducts(storeProducts || []);
      } else {
        setProducts(data.products || []);
      }

      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : "http://localhost:5000/api/products";

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (response.ok) {
        fetchProducts(1, 10000); // Refetch all products after add/edit
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          category_id: "",
          stock_quantity: "",
          image_1: null,
          image_2: null,
          image_3: null,
          artisan_name: "",
          artisan_location: "",
          materials: "",
          dimensions: "",
          weight: "",
          care_instructions: "",
        });
        alert(editingProduct ? "Product updated!" : "Product added!");
      } else {
        alert("Error saving product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category_id: product.category_id || "",
      stock_quantity: product.stock_quantity || "",
      image_1: null,
      image_2: null,
      image_3: null,
      artisan_name: product.artisan_name || "",
      artisan_location: product.artisan_location || "",
      materials: product.materials || "",
      dimensions: product.dimensions || "",
      weight: product.weight || "",
      care_instructions: product.care_instructions || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchProducts(currentPage, productsPerPage);
        alert("Product deleted!");
      } else {
        alert("Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#d4af37" }}>
            Products Management
          </h2>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setFormData({
                name: "",
                description: "",
                price: "",
                category_id: "",
                stock_quantity: "",
                image_1: null,
                image_2: null,
                image_3: null,
                artisan_name: user?.store_name || "",
                artisan_location: user?.store_address || "",
                materials: "",
                dimensions: "",
                weight: "",
                care_instructions: "",
              });
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
            Add Product
          </button>
        </div>

        {showAddForm && (
          <div
            className="mb-6 p-6 rounded-lg"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium" style={{ color: "#d4af37" }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Product Name *
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
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
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
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#ffffff" }}
                >
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
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
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
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
                    Artisan Name
                  </label>
                  <input
                    type="text"
                    name="artisan_name"
                    value={formData.artisan_name}
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
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#ffffff" }}
                >
                  Image 1 (Required) *
                </label>
                <input
                  type="file"
                  name="image_1"
                  onChange={handleInputChange}
                  accept="image/*"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Image 2 (Optional)
                  </label>
                  <input
                    type="file"
                    name="image_2"
                    onChange={handleInputChange}
                    accept="image/*"
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
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Image 3 (Optional)
                  </label>
                  <input
                    type="file"
                    name="image_3"
                    onChange={handleInputChange}
                    accept="image/*"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Artisan Location
                  </label>
                  <input
                    type="text"
                    name="artisan_location"
                    value={formData.artisan_location}
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
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Materials
                  </label>
                  <input
                    type="text"
                    name="materials"
                    value={formData.materials}
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 10x5x2 cm"
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
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 500g"
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
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#ffffff" }}
                  >
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    name="care_instructions"
                    value={formData.care_instructions}
                    onChange={handleInputChange}
                    placeholder="e.g., Hand wash only"
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
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
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
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters Section */}
        <div
          className="mb-6 p-6 rounded-lg"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: "#d4af37" }}>
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
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
              >
                <option value="">All Stock</option>
                <option value="in-stock">In Stock ({">"}0)</option>
                <option value="low-stock">Low Stock (1-10)</option>
                <option value="out-of-stock">Out of Stock (0)</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Min Price
              </label>
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                step="0.01"
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
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Max Price
              </label>
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                step="0.01"
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
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setStockFilter("");
                setMinPrice("");
                setMaxPrice("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: "#555555",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#777777";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#555555";
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

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
              Manage Products
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
              View and manage all products
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
                    Price
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Category
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Stock
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
                {currentProducts.map((product, index) => (
                  <tr
                    key={product.id}
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
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium cursor-pointer hover:underline"
                      style={{ color: "#ffffff" }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      PKR {product.price}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {categories.find((cat) => cat.id === product.category_id)
                        ?.name || "Unknown"}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
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
                        onClick={() => handleDelete(product.id)}
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
            {products.length === 0 && (
              <div className="text-center py-8" style={{ color: "#999999" }}>
                No products found. Add your first product to get started.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: currentPage === 1 ? "#555555" : "#d4af37",
                color: currentPage === 1 ? "#999999" : "#000000",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = "#b8860b";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = "#d4af37";
                }
              }}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className="px-4 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor:
                    currentPage === i + 1 ? "#d4af37" : "#2d2d2d",
                  color: currentPage === i + 1 ? "#000000" : "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== i + 1) {
                    e.currentTarget.style.backgroundColor = "#3d3d3d";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== i + 1) {
                    e.currentTarget.style.backgroundColor = "#2d2d2d";
                  }
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded transition-colors duration-200"
              style={{
                backgroundColor:
                  currentPage === totalPages ? "#555555" : "#d4af37",
                color: currentPage === totalPages ? "#999999" : "#000000",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = "#b8860b";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = "#d4af37";
                }
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <AnalyticsAside userRole="manager" />
    </div>
  );
};

export default ManagerProducts;
