import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaPercentage,
  FaMoneyBillWave,
  FaStore,
  FaBoxOpen,
  FaCheckCircle,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [statsData, setStatsData] = useState({
    activeStores: 0,
    totalProducts: 0,
    customOverrides: 0,
  });

  useEffect(() => {
    fetchCommissions();
  }, [currentPage, perPage]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `http://localhost:5000/api/commissions?page=${currentPage}&per_page=${perPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch commissions");
      }
      const data = await response.json();
      setCommissions(data.commissions || []);

      // Update pagination state
      setCurrentPage(data.pagination?.page || 1);
      setPerPage(data.pagination?.per_page || 10);
      setTotalPages(data.pagination?.pages || 0);
      setTotalItems(data.pagination?.total || 0);
      setHasNext(data.pagination?.has_next || false);
      setHasPrev(data.pagination?.has_prev || false);

      // Calculate stats from current page data
      const grouped = groupCommissionsByStore(data.commissions || []);
      setStatsData({
        activeStores: Object.keys(grouped).length,
        totalProducts: data.pagination?.total || 0,
        customOverrides: (data.commissions || []).filter(
          (c) => c.commission_is_manual
        ).length,
      });
    } catch (error) {
      console.error("Error fetching commissions:", error);
      setError("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (commission) => {
    setEditingId(commission.product_id);
    const percentageValue =
      commission.commission_percentage ??
      commission.tier_commission_percentage ??
      "";
    const amountValue = commission.commission_amount ?? "";
    setEditForm({
      commission_percentage: percentageValue === "" ? "" : `${percentageValue}`,
      commission_amount: amountValue === "" ? "" : `${amountValue}`,
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

      setSuccess("Commission saved successfully");
      setEditingId(null);
      setEditForm({ commission_percentage: "", commission_amount: "" });
      fetchCommissions(); // Refresh the list
    } catch (error) {
      console.error("Error saving commission:", error);
      setError(error.message);
    }
  };

  const handleReset = async (productId) => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/commissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            reset_to_default: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset commission");
      }

      setSuccess("Commission reverted to tier default");
      setEditingId(null);
      fetchCommissions();
    } catch (error) {
      console.error("Error resetting commission:", error);
      setError(error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Pagination functions
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
      <div
        className="flex flex-col justify-center items-center min-h-[50vh] space-y-4"
        style={{ backgroundColor: "#000000", color: "#d4af37" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: "#d4af37" }}
        ></div>
        <span className="text-sm tracking-wide uppercase text-gray-300">
          Loading commissions...
        </span>
      </div>
    );
  }

  const groupedCommissions = groupCommissionsByStore(commissions);

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-2">
              Finance Suite
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#d4af37" }}
            >
              Commission Management
            </h1>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "#cccccc" }}
            >
              Adjust per-product commission overrides while our tiered rules
              power default rates for every new sale.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Active Stores",
              value: statsData.activeStores,
              icon: <FaStore className="text-2xl" />,
            },
            {
              label: "Products Managed",
              value: statsData.totalProducts,
              icon: <FaBoxOpen className="text-2xl" />,
            },
            {
              label: "Custom Overrides",
              value: statsData.customOverrides,
              icon: <FaCheckCircle className="text-2xl" />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl px-5 py-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(33,33,33,0.8), rgba(17,17,17,0.95))",
                border: "1px solid #2d2d2d",
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {label}
                </p>
                <p
                  className="mt-2 text-2xl font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  {value}
                </p>
              </div>
              <span style={{ color: "#d4af37" }}>{icon}</span>
            </div>
          ))}
        </section>

        {/* Pagination Controls */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(33,33,33,0.8), rgba(17,17,17,0.95))",
            border: "1px solid #2d2d2d",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Items per page:</label>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-3 py-1 rounded text-sm bg-gray-800 text-white border border-gray-600 focus:border-d4af37 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, totalItems)} of {totalItems}{" "}
              results
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                hasPrev
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaChevronLeft /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                      pageNum === currentPage
                        ? "bg-d4af37 text-black"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                hasNext
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>

        {(error || success) && (
          <div className="space-y-3">
            {error && (
              <div
                className="px-4 py-3 rounded-xl border"
                style={{
                  backgroundColor: "rgba(255, 82, 82, 0.1)",
                  borderColor: "rgba(255, 82, 82, 0.3)",
                  color: "#ff6b6b",
                }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="px-4 py-3 rounded-xl border"
                style={{
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                  borderColor: "rgba(76, 175, 80, 0.3)",
                  color: "#48bb78",
                }}
              >
                {success}
              </div>
            )}
          </div>
        )}

        <div className="space-y-10">
          {Object.entries(groupedCommissions).map(
            ([storeName, storeCommissions]) => (
              <div
                key={storeName}
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{
                  backgroundColor: "#101010",
                  border: "1px solid #1f1f1f",
                }}
              >
                <div
                  className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(18,18,18,0.95), rgba(36,36,36,0.95))",
                  }}
                >
                  <div>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      {storeName}
                    </h3>
                    <p className="text-sm" style={{ color: "#aaaaaa" }}>
                      {storeCommissions.length} product
                      {storeCommissions.length !== 1 ? "s" : ""} linked to this
                      store
                    </p>
                  </div>
                </div>

                <ul className="divide-y" style={{ borderColor: "#1f1f1f" }}>
                  {storeCommissions.map((commission) => (
                    <li key={commission.product_id} className="px-6 py-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4
                              className="text-lg font-medium"
                              style={{ color: "#ffffff" }}
                            >
                              {commission.product_name}
                            </h4>
                            <p className="text-sm" style={{ color: "#b0b0b0" }}>
                              Price: PKR {commission.price}
                            </p>
                          </div>

                          {editingId === commission.product_id ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wide text-gray-400 flex items-center gap-2">
                                  <FaPercentage className="text-gray-500" />{" "}
                                  Percentage Override
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="e.g. 8"
                                    value={editForm.commission_percentage}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "commission_percentage",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
                                    style={{
                                      backgroundColor: "#1b1b1b",
                                      border: "1px solid #2d2d2d",
                                      color: "#ffffff",
                                    }}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                    %
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wide text-gray-400 flex items-center gap-2">
                                  <FaMoneyBillWave className="text-gray-500" />{" "}
                                  Fixed Amount (PKR)
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                    PKR
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="e.g. 50"
                                    value={editForm.commission_amount}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "commission_amount",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-lg px-4 py-2 text-sm pl-12 focus:outline-none focus:ring-2"
                                    style={{
                                      backgroundColor: "#1b1b1b",
                                      border: "1px solid #2d2d2d",
                                      color: "#ffffff",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              {commission.commission_is_manual ? (
                                <>
                                  {commission.commission_percentage !==
                                    null && (
                                    <span
                                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                      style={{
                                        backgroundColor:
                                          "rgba(78, 205, 196, 0.12)",
                                        color: "#4ecdc4",
                                      }}
                                    >
                                      <FaPercentage className="mr-2" />
                                      {commission.commission_percentage}%
                                    </span>
                                  )}
                                  {commission.commission_amount !== null && (
                                    <span
                                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                      style={{
                                        backgroundColor:
                                          "rgba(244, 208, 63, 0.12)",
                                        color: "#f4d03f",
                                      }}
                                    >
                                      <FaMoneyBillWave className="mr-2" />
                                      PKR {commission.commission_amount}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs"
                                  style={{
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    color: "#bbbbbb",
                                  }}
                                >
                                  Using tier default:{" "}
                                  {commission.tier_commission_percentage ??
                                    "--"}
                                  %
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {editingId === commission.product_id ? (
                            <>
                              <button
                                onClick={() =>
                                  handleSave(commission.product_id)
                                }
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                style={{
                                  backgroundColor: "#d4af37",
                                  color: "#000000",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#b8860b")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#d4af37")
                                }
                              >
                                <FaSave className="mr-2" /> Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold"
                                style={{
                                  backgroundColor: "#1b1b1b",
                                  color: "#cccccc",
                                  border: "1px solid #2d2d2d",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#2a2a2a")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#1b1b1b")
                                }
                              >
                                <FaTimes className="mr-2" /> Cancel
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEdit(commission)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                style={{
                                  backgroundColor: "rgba(212, 175, 55, 0.15)",
                                  color: "#d4af37",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "rgba(212, 175, 55, 0.25)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "rgba(212, 175, 55, 0.15)")
                                }
                              >
                                <FaEdit className="mr-2" /> Edit Override
                              </button>
                              {commission.commission_is_manual && (
                                <button
                                  onClick={() =>
                                    handleReset(commission.product_id)
                                  }
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold"
                                  style={{
                                    backgroundColor: "#1b1b1b",
                                    color: "#bbbbbb",
                                    border: "1px solid #2d2d2d",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#2a2a2a")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#1b1b1b")
                                  }
                                >
                                  <FaUndo className="mr-2" /> Reset to Default
                                </button>
                              )}
                            </div>
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
    </div>
  );
};

export default Commissions;
