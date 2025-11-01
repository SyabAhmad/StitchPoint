import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaEye,
  FaMousePointer,
  FaChartLine,
  FaCog,
  FaStore,
  FaUserCog,
  FaChartBar,
  FaStoreAlt,
  FaComments,
  FaStar,
  FaPlus,
  FaList,
  FaClipboardList,
  FaBuilding,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (
      !token ||
      !userData ||
      !["manager", "super_admin"].includes(userData.role)
    ) {
      window.location.href = "/login";
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-64 shadow-lg min-h-screen"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#2d2d2d" }}>
            <h2 className="text-xl font-bold" style={{ color: "#d4af37" }}>
              Super Admin Panel
            </h2>
          </div>
          <nav className="mt-6">
            <div className="px-6 py-2">
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#d4af37" }}
              >
                Management
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link
                    to="/super-admin-dashboard"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaUsers className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/analytics"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaChartLine className="mr-3 h-5 w-5" />
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/user-management"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaUserCog className="mr-3 h-5 w-5" />
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/products"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaBox className="mr-3 h-5 w-5" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/orders"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/product-analytics"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaChartBar className="mr-3 h-5 w-5" />
                    Product Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/store-analytics"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaStoreAlt className="mr-3 h-5 w-5" />
                    Store Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/comments"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaComments className="mr-3 h-5 w-5" />
                    Comments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/reviews"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaStar className="mr-3 h-5 w-5" />
                    Reviews
                  </Link>
                </li>
              </ul>
            </div>
            <div className="px-6 py-2">
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#d4af37" }}
              >
                Settings
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaStore className="mr-3 h-5 w-5" />
                    Store Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                    style={{ color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                      e.currentTarget.style.color = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <FaCog className="mr-3 h-5 w-5" />
                    System Config
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content: render nested route content here */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
