import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
            Products Management
          </h1>
          <button
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
                {products.map((product, index) => (
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
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      style={{ color: "#ffffff" }}
                    >
                      {product.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      ${product.price}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.category}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
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
      </div>
    </div>
  );
};

export default Products;
