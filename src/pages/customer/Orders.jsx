import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);

        // If viewing specific order, find it
        if (orderId) {
          const order = data.find((o) => o.id === parseInt(orderId));
          setSelectedOrder(order || null);
        }
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Order cancelled successfully");
        loadOrders();
        setSelectedOrder(null);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Error cancelling order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="text-gray-600 hover:text-gray-900 font-semibold mb-4 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-5xl font-extrabold text-gray-900">
              📦 My Orders
            </h1>
            <p className="text-gray-600 mt-2">
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white border-2 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:scale-102 cursor-pointer ${
                        selectedOrder?.id === order.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-900"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            📅{" "}
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${order.total_amount?.toFixed(2)}
                          </p>
                          <span
                            className={`inline-block mt-2 px-4 py-1 text-xs font-bold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status?.charAt(0).toUpperCase() +
                              order.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                  <p className="text-6xl mb-4">📭</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    No orders yet
                  </p>
                  <p className="text-gray-600 mb-6">
                    Start shopping to create your first order!
                  </p>
                  <button
                    onClick={() => navigate("/collections")}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                  >
                    🛍️ Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Order Details */}
            {selectedOrder ? (
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    📋 Order Details
                  </h3>

                  {/* Order Info */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="text-lg font-bold text-gray-900">
                      #{selectedOrder.id}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <span
                      className={`inline-block px-4 py-2 text-sm font-bold rounded-lg ${
                        selectedOrder.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : selectedOrder.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedOrder.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedOrder.status?.charAt(0).toUpperCase() +
                        selectedOrder.status?.slice(1)}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Ordered On</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(selectedOrder.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 pb-6 border-b border-gray-300">
                    <p className="text-sm text-gray-600 mb-2">
                      📍 Shipping Address
                    </p>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedOrder.shipping_address}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-900 mb-3">
                      📦 Items
                    </p>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            Product #{item.product_id} x{item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${selectedOrder.total_amount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedOrder.status === "pending" ||
                  selectedOrder.status === "processing" ? (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                    >
                      ❌ Cancel Order
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/collections")}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                    >
                      🛍️ Shop Again
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center sticky top-6">
                  <p className="text-4xl mb-3">👈</p>
                  <p className="text-gray-600">
                    Select an order to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
