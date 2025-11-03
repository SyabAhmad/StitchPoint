import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const CostPrices = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/cost-prices"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCostPriceChange = (productId, newCostPrice) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, cost_price: newCostPrice }
          : product
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const updates = products
      .filter(
        (product) =>
          product.cost_price !== null && product.cost_price !== undefined
      )
      .map((product) => ({
        product_id: product.id,
        cost_price: parseFloat(product.cost_price) || 0,
      }));

    if (updates.length === 0) {
      setMessage("No valid cost prices to update");
      setSaving(false);
      return;
    }

    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/cost-prices",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message || "Cost prices updated successfully");
      // Refresh products to get updated data
      await fetchProducts();
    } catch (error) {
      console.error("Error updating cost prices:", error);
      setMessage("Failed to update cost prices");
    } finally {
      setSaving(false);
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
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          Manage Cost Prices
        </h1>

        {message && (
          <div
            className="mb-4 p-4 rounded-md"
            style={{
              backgroundColor: message.includes("success")
                ? "#1d4ed8"
                : "#dc2626",
              color: "#ffffff",
            }}
          >
            {message}
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
              Product Cost Prices
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
              Set the cost price for each product to calculate accurate profit
              margins.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: "#2d2d2d" }}>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#cccccc" }}
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#cccccc" }}
                  >
                    Selling Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#cccccc" }}
                  >
                    Cost Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#cccccc" }}
                  >
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#1d1d1d" }}>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={index % 2 === 0 ? "" : ""}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#1d1d1d" : "#2a2a2a",
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm font-medium"
                          style={{ color: "#ffffff" }}
                        >
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: "#cccccc" }}>
                          PKR {product.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={product.cost_price || ""}
                          onChange={(e) =>
                            handleCostPriceChange(product.id, e.target.value)
                          }
                          className="w-24 px-2 py-1 text-sm border rounded-md"
                          style={{
                            backgroundColor: "#333333",
                            color: "#ffffff",
                            borderColor: "#555555",
                          }}
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: "#cccccc" }}>
                          {product.stock_quantity}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="text-sm" style={{ color: "#999999" }}>
                        No products found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50"
            style={{
              backgroundColor: "#d4af37",
              color: "#000000",
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#b8951a";
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#d4af37";
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostPrices;
