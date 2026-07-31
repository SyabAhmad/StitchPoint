import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaTimesCircle,
  FaTruck,
  FaStar,
  FaShoppingBag,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import ReviewModal from "../../components/ReviewModal";
import DeliveryConfirmationModal from "../../components/DeliveryConfirmationModal";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const Orders = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [confirmingDeliveryOrder, setConfirmingDeliveryOrder] = useState(null);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetchWithAuth("http://localhost:5000/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
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
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Cancel this order?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmCancel(id);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Yes, cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const confirmCancel = async (id) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/orders/${id}/cancel`, { method: "PUT" });
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

  const handleReviewSubmitted = () => {
    setReviewingItem(null);
    toast.success("Review submitted successfully!");
    loadOrders();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-500 mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  const statusColor = (status) =>
    status === "delivered"
      ? "bg-green-100 text-green-800"
      : status === "shipped"
      ? "bg-blue-100 text-blue-800"
      : status === "processing"
      ? "bg-yellow-100 text-yellow-800"
      : status === "cancelled"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/customer-dashboard")}
          className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center gap-2 mb-4"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="lg:col-span-2">
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white border rounded-lg p-5 cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id
                      ? "border-gold-500 bg-gold-500/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">PKR {order.total_amount?.toFixed(2)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-1">No orders yet</p>
              <p className="text-sm text-gray-500 mb-6">Start shopping to create your first order!</p>
              <button
                onClick={() => navigate("/collections")}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors"
              >
                <FaShoppingBag className="inline mr-2" />
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Order details */}
        {selectedOrder ? (
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle /> Order Details
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="text-base font-bold text-gray-900">#{selectedOrder.id}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg ${statusColor(selectedOrder.status)}`}>
                    {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Ordered On</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <FaMapMarkerAlt /> Shipping Address
                  </p>
                  <p className="text-sm text-gray-700">{selectedOrder.shipping_address}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">Product #{item.product_id} x{item.quantity}</span>
                        <span className="font-medium text-gray-900">PKR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>PKR {selectedOrder.total_amount?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  {(selectedOrder.status === "pending" || selectedOrder.status === "processing") && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle /> Cancel Order
                    </button>
                  )}

                  {(selectedOrder.status === "shipped" || selectedOrder.status === "delivered") &&
                    !selectedOrder.delivery_confirmed_by_customer && (
                      <button
                        onClick={() => setConfirmingDeliveryOrder(selectedOrder)}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTruck /> Confirm Delivery
                      </button>
                    )}

                  {selectedOrder.status === "delivered" && selectedOrder.delivery_confirmed_by_customer && (
                    <button
                      onClick={() => {
                        const firstItem = selectedOrder.items && selectedOrder.items[0];
                        if (firstItem) {
                          setReviewingItem({ order: selectedOrder, item: firstItem });
                        }
                      }}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaStar /> Leave Review
                    </button>
                  )}

                  {selectedOrder.status !== "pending" &&
                    selectedOrder.status !== "processing" &&
                    selectedOrder.status !== "delivered" &&
                    selectedOrder.status !== "shipped" && (
                      <button
                        onClick={() => navigate("/collections")}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaShoppingBag /> Shop Again
                      </button>
                    )}

                  {selectedOrder.status === "delivery_issue" && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                      <p className="font-semibold text-red-800 flex items-center gap-1">
                        <FaExclamationTriangle /> Delivery Issue Reported
                      </p>
                      <p className="text-xs text-red-600 mt-1">Store manager will contact you to resolve this.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center sticky top-6">
              <FaInfoCircle className="mx-auto text-3xl text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Select an order to view details</p>
            </div>
          </div>
        )}
      </div>

      {confirmingDeliveryOrder && (
        <DeliveryConfirmationModal
          order={confirmingDeliveryOrder}
          onClose={() => setConfirmingDeliveryOrder(null)}
          onConfirmed={() => {
            setConfirmingDeliveryOrder(null);
            loadOrders();
          }}
        />
      )}

      {reviewingItem && (
        <ReviewModal
          order={reviewingItem.order}
          orderItem={reviewingItem.item}
          onClose={() => setReviewingItem(null)}
          onSubmit={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default Orders;
