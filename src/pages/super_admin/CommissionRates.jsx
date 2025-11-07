import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPercentage,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const CommissionRates = () => {
  const [loading, setLoading] = useState(true);
  const [commissionRates, setCommissionRates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    min_price: 0,
    max_price: "",
    commission_percentage: 0,
  });

  useEffect(() => {
    fetchCommissionRates();
  }, []);

  const fetchCommissionRates = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/commission-rates"
      );
      if (response.ok) {
        const data = await response.json();
        setCommissionRates(data.commission_rates || []);
      }
    } catch (error) {
      console.error("Error fetching commission rates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingRate
        ? `http://localhost:5000/api/commission-rates/${editingRate.id}`
        : "http://localhost:5000/api/commission-rates";
      const method = editingRate ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          max_price:
            formData.max_price === "" ? null : parseFloat(formData.max_price),
        }),
      });

      if (response.ok) {
        await fetchCommissionRates();
        resetForm();
        alert(
          editingRate
            ? "Commission rate updated successfully!"
            : "Commission rate created successfully!"
        );
      } else {
        const error = await response.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      console.error("Error saving commission rate:", error);
      alert("Error saving commission rate");
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      name: rate.name,
      min_price: rate.min_price,
      max_price: rate.max_price || "",
      commission_percentage: rate.commission_percentage,
    });
    setShowForm(true);
  };

  const handleDelete = async (rateId) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this commission rate?"
      )
    ) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/api/commission-rates/${rateId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchCommissionRates();
        alert("Commission rate deactivated successfully!");
      } else {
        const error = await response.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      console.error("Error deactivating commission rate:", error);
      alert("Error deactivating commission rate");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      min_price: 0,
      max_price: "",
      commission_percentage: 0,
    });
    setEditingRate(null);
    setShowForm(false);
  };

  const calculatePreview = (price) => {
    const rate = commissionRates.find(
      (r) =>
        r.is_active &&
        price >= r.min_price &&
        (r.max_price === null || price <= r.max_price)
    );
    return rate
      ? ((price * rate.commission_percentage) / 100).toFixed(2)
      : "0.00";
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading commission rates...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
              Commission Rate Management
            </h1>
            <p className="mt-2" style={{ color: "#cccccc" }}>
              Manage tiered commission rates based on product prices
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: "#d4af37", color: "#000000" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b8860b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#d4af37")
            }
          >
            <FaPlus className="mr-2" />
            Add New Rate
          </button>
        </div>

        {/* Info Box */}
        <div
          className="p-4 rounded-lg mb-6"
          style={{ backgroundColor: "#1d1d1d", border: "1px solid #2d2d2d" }}
        >
          <div className="flex items-start">
            <FaInfoCircle className="mr-3 mt-1" style={{ color: "#d4af37" }} />
            <div>
              <h3 className="font-semibold mb-2">
                How Tiered Commission Works
              </h3>
              <p style={{ color: "#cccccc" }}>
                Commission rates are automatically applied based on product
                price ranges. When a product is sold, the system finds the
                applicable rate and calculates the commission accordingly. This
                ensures consistent commission calculation across all products.
              </p>
            </div>
          </div>
        </div>

        {/* Commission Rates Table */}
        <div
          className="shadow rounded-lg overflow-hidden"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "#2d2d2d" }}
          >
            <h2 className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              Current Commission Rates
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#2d2d2d" }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Rate Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Price Range
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Commission %
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#2d2d2d" }}>
                {commissionRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaChartLine
                          className="mr-3"
                          style={{ color: "#d4af37" }}
                        />
                        <div>
                          <div
                            className="text-sm font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {rate.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: "#cccccc" }}>
                        ${rate.min_price} - ${rate.max_price || "Unlimited"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaPercentage
                          className="mr-2"
                          style={{ color: "#4ecdc4" }}
                        />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "#4ecdc4" }}
                        >
                          {rate.commission_percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rate.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        style={{
                          backgroundColor: rate.is_active
                            ? "rgba(72, 187, 120, 0.2)"
                            : "rgba(245, 101, 101, 0.2)",
                          color: rate.is_active ? "#48bb78" : "#f56565",
                        }}
                      >
                        {rate.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="p-2 rounded-lg transition-colors duration-200"
                          style={{
                            backgroundColor: "#2d2d2d",
                            color: "#d4af37",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#3d3d3d")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2d2d2d")
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(rate.id)}
                          className="p-2 rounded-lg transition-colors duration-200"
                          style={{
                            backgroundColor: "#2d2d2d",
                            color: "#ef4444",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#3d3d3d")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2d2d2d")
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Preview Calculator */}
        <div
          className="mt-8 p-6 rounded-lg"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "#d4af37" }}
          >
            Commission Calculator
          </h3>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#cccccc" }}
              >
                Product Price
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter product price"
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: "#2d2d2d",
                  borderColor: "#3d3d3d",
                  color: "#ffffff",
                }}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;
                  const commission = calculatePreview(price);
                  const remaining = price - commission;
                  document.getElementById(
                    "commission-preview"
                  ).textContent = `PKR ${commission.toFixed(2)}`;
                  document.getElementById(
                    "store-revenue"
                  ).textContent = `PKR ${remaining.toFixed(2)}`;
                }}
              />
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: "#cccccc" }}>
                Commission
              </div>
              <div
                className="text-xl font-bold"
                id="commission-preview"
                style={{ color: "#4ecdc4" }}
              >
                PKR 0.00
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: "#cccccc" }}>
                Store Revenue
              </div>
              <div
                className="text-xl font-bold"
                id="store-revenue"
                style={{ color: "#d4af37" }}
              >
                PKR 0.00
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className="rounded-lg p-6 w-full max-w-md"
              style={{ backgroundColor: "#1d1d1d" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#d4af37" }}
                >
                  {editingRate
                    ? "Edit Commission Rate"
                    : "Add New Commission Rate"}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: "#2d2d2d", color: "#cccccc" }}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#cccccc" }}
                    >
                      Rate Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border"
                      style={{
                        backgroundColor: "#2d2d2d",
                        borderColor: "#3d3d3d",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#cccccc" }}
                    >
                      Minimum Price (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      value={formData.min_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-3 rounded-lg border"
                      style={{
                        backgroundColor: "#2d2d2d",
                        borderColor: "#3d3d3d",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#cccccc" }}
                    >
                      Maximum Price (PKR) - Leave empty for unlimited
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_price}
                      onChange={(e) =>
                        setFormData({ ...formData, max_price: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border"
                      style={{
                        backgroundColor: "#2d2d2d",
                        borderColor: "#3d3d3d",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#cccccc" }}
                    >
                      Commission Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min="0"
                      max="100"
                      value={formData.commission_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commission_percentage:
                            parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-3 rounded-lg border"
                      style={{
                        backgroundColor: "#2d2d2d",
                        borderColor: "#3d3d3d",
                        color: "#ffffff",
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: "#2d2d2d", color: "#cccccc" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                    style={{ backgroundColor: "#d4af37", color: "#000000" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#b8860b")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d4af37")
                    }
                  >
                    <FaSave className="mr-2" />
                    {editingRate ? "Update" : "Create"} Rate
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

export default CommissionRates;
