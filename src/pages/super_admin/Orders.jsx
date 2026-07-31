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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchOrders = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/orders/admin/all", {
      headers: { Authorization: `Bearer ${token}` },
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
    const userData = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(userData);
    fetchOrders();
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <FaCheckCircle />;
      case "shipped": return <FaTruck />;
      case "processing": return <FaBox />;
      default: return <FaClock />;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "delivered": return "bg-emerald-500/10 text-emerald-400";
      case "shipped": return "bg-blue-500/10 text-blue-400";
      case "processing": return "bg-amber-500/10 text-amber-400";
      default: return "bg-white/5 text-white/40";
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

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">All Orders</h1>
        <p className="text-xs text-white/30 mt-1">Click any order to view details and update status</p>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        <ul className="divide-y divide-white/5">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li
                key={order.id}
                className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gold-500 font-medium text-sm">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${getStatusClasses(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                    <span className="text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded">
                      {order.store_name || "Unknown Store"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">PKR {order.total_amount}</span>
                    <FaEye className="text-gold-500/50 text-xs" />
                  </div>
                </div>
                <div className="mt-1.5 text-xs text-white/40">
                  By <span className="text-white/60">{order.customer_name}</span> &bull; {new Date(order.created_at).toLocaleDateString()}
                </div>
              </li>
            ))
          ) : (
            <li className="px-5 py-10 text-center text-white/30 text-sm">No orders found</li>
          )}
        </ul>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gold-500">Order #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-white/30 hover:text-white transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Store</p>
                <p className="text-sm text-white">{selectedOrder.store_name}</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-sm text-white">{selectedOrder.customer_name}</p>
                <p className="text-xs text-white/40">{selectedOrder.customer_email}</p>
                <p className="text-xs text-white/30 mt-1">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Items ({selectedOrder.items_count})</p>
                {selectedOrder.items?.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-white/50 py-1.5 border-b border-white/5 last:border-0">
                      <span>Product #{item.product_id} &times; {item.quantity}</span>
                      <span>PKR {item.price}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/30">No items</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Shipping Address</p>
                <p className="text-sm text-white/60">{selectedOrder.shipping_address || "No address provided"}</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Update Status</p>
                <p className="text-xs text-white/40">Only the store manager can update order status.</p>
              </div>

              <div className="text-right p-3 rounded-lg bg-gold-500/10">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Total</p>
                <p className="text-xl font-bold text-gold-500">PKR {selectedOrder.total_amount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
