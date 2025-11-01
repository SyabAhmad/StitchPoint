import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/orders/manager/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success(`Order status updated to ${status}`);
      setSelectedOrder(null);
      setNewStatus("");
      setUpdating(false);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
      setUpdating(false);
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
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle />;
      case "shipped":
        return <FaTruck />;
      case "processing":
        return <FaBox />;
      default:
        return <FaClock />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return {
          backgroundColor: "rgba(72, 187, 120, 0.2)",
          color: "#48bb78",
        };
      case "shipped":
        return {
          backgroundColor: "rgba(66, 153, 225, 0.2)",
          color: "#4299e1",
        };
      case "processing":
        return {
          backgroundColor: "rgba(237, 137, 54, 0.2)",
          color: "#ed8936",
        };
      default:
        return {
          backgroundColor: "rgba(160, 174, 192, 0.2)",
          color: "#a0aec0",
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#d4af37" }}>
        📦 Orders Management
      </h2>

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
            Manage Orders
          </h3>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
            👇 Click on any order to view details and update status
          </p>
        </div>
        <ul className="divide-y" style={{ borderColor: "#2d2d2d" }}>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <li
                key={order.id}
                className="transition-colors duration-150 cursor-pointer"
                style={{
                  backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                }}
                onClick={() => {
                  setSelectedOrder(order);
                  setNewStatus(order.status);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#262626";
                  e.currentTarget.style.transform = "scale(1.01)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p
                        className="text-sm font-medium truncate mr-2 transition-colors duration-200"
                        style={{ color: "#d4af37" }}
                      >
                        Order #{order.id}
                      </p>
                      <span
                        className="px-2 py-1 text-xs leading-5 font-semibold rounded-full flex items-center"
                        style={getStatusStyle(order.status)}
                      >
                        <span className="mr-1">
                          {getStatusIcon(order.status)}
                        </span>
                        {order.status}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center">
                      <p
                        className="text-sm font-medium mr-4"
                        style={{ color: "#ffffff" }}
                      >
                        ${order.total_amount}
                      </p>
                      <FaEye style={{ color: "#d4af37" }} />
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p
                        className="flex items-center text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        By{" "}
                        <span
                          className="font-medium ml-1"
                          style={{ color: "#ffffff" }}
                        >
                          {order.customer_name}
                        </span>{" "}
                        •{" "}
                        <span className="ml-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>
              <div className="px-4 py-8 sm:px-6 text-center">
                <p className="text-sm" style={{ color: "#999999" }}>
                  No orders found
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
            style={{ backgroundColor: "#1d1d1d" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold" style={{ color: "#d4af37" }}>
                Order #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Customer Info */}
            <div
              className="mb-6 pb-4"
              style={{ borderBottom: "1px solid #2d2d2d" }}
            >
              <p style={{ color: "#cccccc" }} className="mb-2">
                <span style={{ color: "#d4af37" }} className="font-semibold">
                  Customer:
                </span>{" "}
                {selectedOrder.customer_name}
              </p>
              <p style={{ color: "#cccccc" }} className="mb-2">
                <span style={{ color: "#d4af37" }} className="font-semibold">
                  Email:
                </span>{" "}
                {selectedOrder.customer_email}
              </p>
              <p style={{ color: "#cccccc" }}>
                <span style={{ color: "#d4af37" }} className="font-semibold">
                  Order Date:
                </span>{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Items */}
            <div
              className="mb-6 pb-4"
              style={{ borderBottom: "1px solid #2d2d2d" }}
            >
              <h4 style={{ color: "#d4af37" }} className="font-bold mb-3">
                📦 Items:
              </h4>
              <div>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ color: "#cccccc", backgroundColor: "#2d2d2d" }}
                      className="mb-3 p-2 rounded"
                    >
                      <p className="font-semibold">
                        Product ID: {item.product_id}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#999999" }}>No items in this order</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div
              className="mb-6 pb-4"
              style={{ borderBottom: "1px solid #2d2d2d" }}
            >
              <h4 style={{ color: "#d4af37" }} className="font-bold mb-2">
                📍 Shipping Address:
              </h4>
              <p style={{ color: "#cccccc" }}>
                {selectedOrder.shipping_address || "No address provided"}
              </p>
            </div>

            {/* Status Update */}
            <div
              className="mb-6 pb-4"
              style={{ borderBottom: "1px solid #2d2d2d" }}
            >
              <h4 style={{ color: "#d4af37" }} className="font-bold mb-3">
                🔄 Update Status:
              </h4>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded mb-3"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">⚙️ Processing</option>
                <option value="shipped">🚚 Shipped</option>
                <option value="delivered">✅ Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
              <button
                onClick={() => handleStatusChange(selectedOrder.id, newStatus)}
                disabled={updating || newStatus === selectedOrder.status}
                className="w-full px-4 py-2 rounded font-semibold transition"
                style={{
                  backgroundColor: updating ? "#666666" : "#d4af37",
                  color: "#000000",
                  opacity:
                    updating || newStatus === selectedOrder.status ? 0.6 : 1,
                  cursor:
                    updating || newStatus === selectedOrder.status
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {updating ? "⏳ Updating..." : "✨ Update Status"}
              </button>
            </div>

            {/* Total */}
            <div className="text-right bg-gradient-to-r from-yellow-600 to-yellow-800 p-3 rounded">
              <p style={{ color: "#ffffff" }} className="text-sm mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold" style={{ color: "#d4af37" }}>
                ${selectedOrder.total_amount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOrders;
