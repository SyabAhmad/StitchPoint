import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaPercentage,
  FaDollarSign,
} from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const Commissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    commission_percentage: "",
    commission_amount: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        "http://localhost:5000/api/commissions"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch commissions");
      }
      const data = await response.json();
      setCommissions(data.commissions || []);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      setError("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (commission) => {
    setEditingId(commission.product_id);
    setEditForm({
      commission_percentage: commission.commission_percentage || "",
      commission_amount: commission.commission_amount || "",
    });
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ commission_percentage: "", commission_amount: "" });
    setError("");
  };

  const handleSave = async (productId) => {
    try {
      const data = {
        product_id: productId,
        commission_percentage: editForm.commission_percentage
          ? parseFloat(editForm.commission_percentage)
          : null,
        commission_amount: editForm.commission_amount
          ? parseFloat(editForm.commission_amount)
          : null,
      };

      const response = await fetchWithAuth(
        "http://localhost:5000/api/commissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save commission");
      }

      const result = await response.json();
      setSuccess("Commission saved successfully");
      setEditingId(null);
      setEditForm({ commission_percentage: "", commission_amount: "" });
      fetchCommissions(); // Refresh the list
    } catch (error) {
      console.error("Error saving commission:", error);
      setError(error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const groupCommissionsByStore = (commissions) => {
    const grouped = {};
    commissions.forEach((commission) => {
      const storeName = commission.store_name;
      if (!grouped[storeName]) {
        grouped[storeName] = [];
      }
      grouped[storeName].push(commission);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const groupedCommissions = groupCommissionsByStore(commissions);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Commission Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Set commission rates for products from each store. You can set
            either a percentage or fixed amount commission.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="mt-8 space-y-8">
        {Object.entries(groupedCommissions).map(
          ([storeName, storeCommissions]) => (
            <div
              key={storeName}
              className="bg-white shadow overflow-hidden sm:rounded-md"
            >
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {storeName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {storeCommissions.length} product
                  {storeCommissions.length !== 1 ? "s" : ""}
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {storeCommissions.map((commission) => (
                  <li key={commission.product_id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {commission.product_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              ${commission.price}
                            </p>
                          </div>
                          <div className="ml-4 flex-1">
                            {editingId === commission.product_id ? (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <FaPercentage className="text-gray-400" />
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Percentage"
                                    value={editForm.commission_percentage}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "commission_percentage",
                                        e.target.value
                                      )
                                    }
                                    className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  />
                                  <span className="text-sm text-gray-500">
                                    %
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FaDollarSign className="text-gray-400" />
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Fixed amount"
                                    value={editForm.commission_amount}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "commission_amount",
                                        e.target.value
                                      )
                                    }
                                    className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-900">
                                {commission.commission_percentage && (
                                  <div className="flex items-center">
                                    <FaPercentage className="mr-1 text-gray-400" />
                                    {commission.commission_percentage}%
                                    commission
                                  </div>
                                )}
                                {commission.commission_amount && (
                                  <div className="flex items-center">
                                    <FaDollarSign className="mr-1 text-gray-400" />
                                    ${commission.commission_amount} commission
                                  </div>
                                )}
                                {!commission.commission_percentage &&
                                  !commission.commission_amount && (
                                    <span className="text-gray-500">
                                      No commission set
                                    </span>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {editingId === commission.product_id ? (
                          <>
                            <button
                              onClick={() => handleSave(commission.product_id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <FaSave className="mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <FaTimes className="mr-1" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(commission)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Commissions;
