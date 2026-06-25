import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShoppingCart,
  FaPercent,
  FaBox,
  FaCog,
} from "react-icons/fa";
import { fetchWithAuth } from "../utils/fetchWithAuth.js";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        "http://localhost:5000/api/notifications?limit=10"
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/notifications/unread"
      );
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "commission_change":
        return <FaPercent className="text-blue-400" />;
      case "order_status":
        return <FaShoppingCart className="text-green-400" />;
      case "product":
        return <FaBox className="text-purple-400" />;
      case "system":
        return <FaCog className="text-yellow-400" />;
      default:
        return <FaInfoCircle className="text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "commission_change":
        return "border-l-blue-400 bg-blue-900/20";
      case "order_status":
        return "border-l-green-400 bg-green-900/20";
      case "product":
        return "border-l-purple-400 bg-purple-900/20";
      case "system":
        return "border-l-yellow-400 bg-yellow-900/20";
      default:
        return "border-l-gray-400 bg-gray-900/20";
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg transition-colors duration-200"
        style={{ backgroundColor: "#2d2d2d", color: "#ffffff" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#3d3d3d")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#2d2d2d")
        }
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-xs font-bold rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              width: "18px",
              height: "18px",
              fontSize: "10px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 top-full mt-2 w-96 rounded-lg shadow-lg z-50"
          style={{ backgroundColor: "#1d1d1d", border: "1px solid #2d2d2d" }}
        >
          <div className="p-4 border-b" style={{ borderColor: "#2d2d2d" }}>
            <div className="flex items-center justify-between">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#d4af37" }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm px-2 py-1 rounded"
                  style={{ backgroundColor: "#2d2d2d", color: "#cccccc" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3d3d3d")
                  }
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center" style={{ color: "#cccccc" }}>
                <FaInfoCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 hover:bg-gray-900 transition-colors duration-200 cursor-pointer ${
                      notification.is_read ? "opacity-75" : ""
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() =>
                      !notification.is_read && markAsRead(notification.id)
                    }
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "#ffffff" }}
                          >
                            {notification.title}
                          </h4>
                          <span
                            className="text-xs"
                            style={{ color: "#999999" }}
                          >
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#cccccc" }}
                        >
                          {notification.message}
                        </p>
                        {!notification.is_read && (
                          <div className="mt-2">
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#d4af37" }}
                            ></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div
              className="p-3 border-t text-center"
              style={{ borderColor: "#2d2d2d" }}
            >
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Navigate to notifications page
                  window.location.href = "/notifications";
                }}
                className="text-sm font-medium"
                style={{ color: "#d4af37" }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationCenter;
