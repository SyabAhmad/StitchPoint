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

    // Auth OK, stop loading — child routes will fetch their own data
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Super Admin Panel
            </h2>
          </div>
          <nav className="mt-6">
            <div className="px-6 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Management
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link
                    to="/super-admin-dashboard"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaUsers className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/analytics"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaChartLine className="mr-3 h-5 w-5" />
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/user-management"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaUserCog className="mr-3 h-5 w-5" />
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/products"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaBox className="mr-3 h-5 w-5" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/super-admin-dashboard/orders"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div className="px-6 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaStore className="mr-3 h-5 w-5" />
                    Store Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
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
