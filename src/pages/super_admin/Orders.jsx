import React, { useState, useEffect } from "react";
import { FaEye, FaTruck, FaCheckCircle, FaClock, FaBox } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Assuming there's an orders endpoint, if not, this will need to be implemented
    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

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
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          Orders Management
        </h1>

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
              View and manage all orders
            </p>
          </div>
          <ul className="divide-y" style={{ borderColor: "#2d2d2d" }}>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <li
                  key={order.id}
                  className="transition-colors duration-150"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f1f1f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
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
                        <p className="flex-shrink-0 flex">
                          <span
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full flex items-center"
                            style={getStatusStyle(order.status)}
                          >
                            <span className="mr-1">
                              {getStatusIcon(order.status)}
                            </span>
                            {order.status}
                          </span>
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex items-center">
                        <p
                          className="text-sm font-medium mr-4"
                          style={{ color: "#ffffff" }}
                        >
                          ${order.total_amount}
                        </p>
                        <button
                          className="p-1 rounded transition-colors duration-200"
                          style={{ color: "#d4af37" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(212, 175, 55, 0.1)";
                            e.currentTarget.style.color = "#b8860b";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#d4af37";
                          }}
                        >
                          <FaEye />
                        </button>
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
                            {order.user_email}
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
      </div>
    </div>
  );
};

export default Orders;
