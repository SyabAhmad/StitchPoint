import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-widest uppercase" style={{ color: "#ffffff" }}>
            PRODUCTS
          </h1>
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
              ALL PRODUCTS
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#888888" }}>
              View all products across all stores
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:underline"
                        style={{ color: "#d4af37" }}
                      >
                        {product.name}
                      </Link>
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
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;