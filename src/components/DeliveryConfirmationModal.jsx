import React, { useState } from "react";
import { FaTimes, FaBox, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

const DeliveryConfirmationModal = ({ order, onClose, onConfirmed }) => {
  const [received, setReceived] = useState(true);
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!received && !issueDescription.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order.id}/confirm-delivery`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            received,
            issue_description: issueDescription || null,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setIsSubmitting(false);
        onConfirmed();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to confirm delivery");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Error confirming delivery");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📦 Confirm Delivery
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Order #:</span> {order.id}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Items:</span>{" "}
              {order.items?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Amount:</span> $
              {order.total_amount?.toFixed(2)}
            </p>
          </div>

          {/* Delivery Status Question */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-bold text-gray-900 mb-4">
              Did you receive the package?
            </p>

            <div className="space-y-3">
              {/* Yes Option */}
              <label
                className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setReceived(true)}
              >
                <input
                  type="radio"
                  name="delivery_status"
                  value="yes"
                  checked={received}
                  onChange={() => setReceived(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Yes, I received it
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    The package arrived in good condition
                  </p>
                </div>
              </label>

              {/* No Option */}
              <label
                className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setReceived(false)}
              >
                <input
                  type="radio"
                  name="delivery_status"
                  value="no"
                  checked={!received}
                  onChange={() => setReceived(false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-600" /> No, I
                    didn't receive it
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    There's an issue with delivery
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Issue Description (visible if not received) */}
          {!received && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📝 What happened? (Please describe the issue)
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="E.g., Package not delivered, damaged during transit, missing items, etc."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:bg-red-50 transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {issueDescription.length}/500 characters
              </p>
            </div>
          )}

          {/* Success Message (visible if received) */}
          {received && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✨ Great! Once confirmed, you'll be able to leave a review for
                this order.
              </p>
            </div>
          )}

          {/* Issue Help Message */}
          {!received && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                ⚠️ The store manager will contact you shortly to resolve this
                issue. Make sure your contact information is correct.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!received && !issueDescription.trim())}
              className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                received
                  ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Confirming..."
                : received
                ? "✓ Confirm Received"
                : "⚠️ Report Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryConfirmationModal;
