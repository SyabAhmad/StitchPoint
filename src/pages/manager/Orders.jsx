import React, { useState, useEffect } from "react";
import { FaEye, FaTruck, FaCheckCircle, FaClock, FaBox, FaTimes } from "react-icons/fa";
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
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch((error) => { console.error("Error fetching orders:", error); toast.error("Failed to load orders"); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      toast.success(`Order status updated to ${status}`);
      setSelectedOrder(null);
      setNewStatus("");
      setUpdating(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-3"></div>
          <span className="text-white/40 text-sm">Loading orders...</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <FaCheckCircle />;
      case "shipped": return <FaTruck />;
      case "processing": return <FaBox />;
      default: return <FaClock />;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gold-500 mb-6">Orders Management</h2>

      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Manage Orders</h3>
          <p className="text-[11px] text-white/30 mt-0.5">Click on any order to view details and update status</p>
        </div>
        <div className="divide-y divide-white/5">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id}
                className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gold-500 font-medium text-sm">Order #{order.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                      order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                      order.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                      order.status === "processing" ? "bg-amber-500/10 text-amber-400" :
                      order.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                      "bg-white/5 text-white/40"
                    }`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white">PKR {order.total_amount}</span>
                    <FaEye className="text-gold-500/50" size={14} />
                  </div>
                </div>
                <div className="mt-1.5">
                  <span className="text-xs text-white/40">
                    By <span className="text-white/60">{order.customer_name}</span> &bull; {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-white/30 text-sm">No orders found</div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#111] border border-white/5 rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gold-500">Order #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-white/30 hover:text-white transition-colors">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="mb-5 pb-4 border-b border-white/5">
              <p className="text-sm text-white/60 mb-1"><span className="text-gold-500 font-medium">Customer:</span> {selectedOrder.customer_name}</p>
              <p className="text-sm text-white/60 mb-1"><span className="text-gold-500 font-medium">Email:</span> {selectedOrder.customer_email}</p>
              <p className="text-sm text-white/60"><span className="text-gold-500 font-medium">Order Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
            </div>

            <div className="mb-5 pb-4 border-b border-white/5">
              <h4 className="text-sm font-semibold text-gold-500 mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white/[0.03] rounded-lg text-sm">
                      <p className="text-white font-medium">Product ID: {item.product_id}</p>
                      <p className="text-white/50">Qty: {item.quantity} &bull; PKR {item.price}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/30">No items in this order</p>
                )}
              </div>
            </div>

            <div className="mb-5 pb-4 border-b border-white/5">
              <h4 className="text-sm font-semibold text-gold-500 mb-2">Shipping Address</h4>
              <p className="text-sm text-white/60">{selectedOrder.shipping_address || "No address provided"}</p>
            </div>

            <div className="mb-5 pb-4 border-b border-white/5">
              <h4 className="text-sm font-semibold text-gold-500 mb-3">Update Status</h4>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40 mb-3">
                <option value="pending" className="bg-[#111]">Pending</option>
                <option value="processing" className="bg-[#111]">Processing</option>
                <option value="shipped" className="bg-[#111]">Shipped</option>
                <option value="delivered" className="bg-[#111]">Delivered</option>
                <option value="cancelled" className="bg-[#111]">Cancelled</option>
              </select>
              <button onClick={() => handleStatusChange(selectedOrder.id, newStatus)}
                disabled={updating || newStatus === selectedOrder.status}
                className="w-full px-4 py-2 bg-gold-500 text-black text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>

            <div className="text-right p-3 bg-gold-500/10 rounded-lg">
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-0.5">Total Amount</p>
              <p className="text-lg font-bold text-gold-500">PKR {selectedOrder.total_amount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOrders;
