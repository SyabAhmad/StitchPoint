import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "",
    image_1: null,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });

    fetch("http://localhost:5000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({ ...prev, image_1: file }));
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    setCreating(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock_quantity", newProduct.stock_quantity);
    formData.append("category_id", newProduct.category_id);
    if (newProduct.image_1) {
      formData.append("image_1", newProduct.image_1);
    }

    fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.product || data.id) {
          setProducts((prev) => [data.product || data, ...prev]);
          setShowCreateForm(false);
          setNewProduct({
            name: "",
            description: "",
            price: "",
            category_id: "",
            stock_quantity: "",
            image_1: null,
          });
          alert("Product created successfully");
        } else {
          alert(data.message || "Error creating product");
        }
      })
      .catch((err) => {
        console.error("Error creating product:", err);
        alert("Error creating product");
      })
      .finally(() => setCreating(false));
  };

  const handleDeleteProduct = (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem("token");
    fetchWithAuth(`http://localhost:5000/api/products/${productId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          alert("Product deleted successfully");
        } else {
          alert(data.error || "Error deleting product");
        }
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
        alert("Error deleting product");
      });
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-widest uppercase" style={{ color: "#ffffff" }}>
            PRODUCTS
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 rounded-md transition-all duration-200 font-bold tracking-widest uppercase text-sm"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cccccc";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaPlus className="mr-2" />
            ADD PRODUCT
          </button>
        </div>

        <div
          className="border border-white/10"
          style={{ backgroundColor: "#111111" }}
        >
          <div
            className="px-4 py-5 sm:px-6 border-b"
            style={{ borderColor: "#333333" }}
          >
            <h3
              className="text-lg leading-6 font-medium"
              style={{ color: "#ffffff" }}
            >
              MANAGE PRODUCTS
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#888888" }}>
              View and manage all products
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: "#222222" }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#ffffff" }}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#ffffff" }}>
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#ffffff" }}>
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#ffffff" }}>
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#ffffff" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#111111" : "#1a1a1a",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#ffffff" }}>
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#ffffff" }}>
                      PKR {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: "#888888" }}>
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: product.stock_quantity > 0 ? "#ffffff" : "#ff0000" }}>
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="transition-colors duration-200 mr-4"
                        style={{ color: "#ffffff" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#cccccc";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                        }}
                      >
                        <FaEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        className="transition-colors duration-200"
                        style={{ color: "#ff4444" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#cc0000";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#ff4444";
                        }}
                        onClick={() => handleDeleteProduct(product.id)}
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
              <div className="text-center py-8" style={{ color: "#888888" }}>
                No products found. Add your first product to get started.
              </div>
            )}
          </div>
        </div>

        {showCreateForm && (
          <div
            className="border border-white/10 mt-6"
            style={{ backgroundColor: "#111111" }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-widest uppercase" style={{ color: "#ffffff" }}>
                  ADD PRODUCT
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  style={{ color: "#888888" }}
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
                      NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-white/20 text-white"
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
                      DESCRIPTION
                    </label>
                    <input
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-white/20 text-white"
                      placeholder="Description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
                      PRICE *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-white/20 text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
                      STOCK *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-white/20 text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
                      CATEGORY *
                    </label>
                    <select
                      required
                      value={newProduct.category_id}
                      onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-white/20 text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
                      IMAGE
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 bg-black border border-white/20 text-white file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-white file:text-black file:cursor-pointer"
                    />
                    {newProduct.image_1 && (
                      <p className="mt-2 text-sm" style={{ color: "#888888" }}>Selected: {newProduct.image_1.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2 border border-white/20 font-bold tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-colors"
                    style={{ color: "#ffffff" }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2 font-bold tracking-widest uppercase text-sm transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                  >
                    {creating ? "CREATING..." : "CREATE"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;