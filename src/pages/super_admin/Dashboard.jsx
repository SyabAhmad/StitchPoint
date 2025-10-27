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
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

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

    setCurrentUser(userData);

    // If super_admin, fetch users for quick overview
    if (userData.role === "super_admin") {
      const token = localStorage.getItem("token");
      if (!token) {
        // missing token — redirect to login
        window.location.href = "/login";
        return;
      }

      setUsersLoading(true);
      // debug: log token used for request
      console.log("[debug] dashboard users fetch token:", token);
      fetch("http://localhost:5000/api/dashboard/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (r) => {
          // debug: log status
          console.log("[debug] /api/dashboard/users status:", r.status);
          let text = "";
          try {
            text = await r.text();
          } catch {
            text = "";
          }
          console.log("[debug] /api/dashboard/users response text:", text);
          if (!r.ok) {
            // attempt to parse json if any
            let parsed;
            try {
              parsed = JSON.parse(text || "{}");
            } catch {
              parsed = { message: text };
            }
            // do not auto-clear auth here; surface the error for debugging
            throw new Error(
              parsed.message || `Request failed with status ${r.status}`
            );
          }
          // if ok, parse as json
          return JSON.parse(text || "{}");
        })
        .then((data) => {
          setUsers(data.users || []);
          setUsersLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users for dashboard overview:", err);
          setUsers([]);
          setUsersLoading(false);
        });
    } else {
      setUsers([]);
      setUsersLoading(false);
    }

    // Auth OK, stop loading — child routes will fetch their own data if needed
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
            {/* Users overview for super admin - improved UX + responsive layout */}
            {currentUser && currentUser.role === "super_admin" && (
              <section className="mb-6">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#ffffff" }}
                >
                  Users Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div
                    className="shadow rounded-lg p-4 flex items-center"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div
                      className="p-3 rounded-full mr-4"
                      style={{
                        backgroundColor: "rgba(212, 175, 55, 0.2)",
                        color: "#d4af37",
                      }}
                    >
                      <FaUsers />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#cccccc" }}>
                        Total users
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#ffffff" }}
                      >
                        {usersLoading ? "—" : users.length}
                      </p>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-4 flex items-center"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div
                      className="p-3 rounded-full mr-4"
                      style={{
                        backgroundColor: "rgba(212, 175, 55, 0.2)",
                        color: "#d4af37",
                      }}
                    >
                      <FaUserCog />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#cccccc" }}>
                        Managers
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#ffffff" }}
                      >
                        {usersLoading
                          ? "—"
                          : users.filter((u) => u.role === "manager").length}
                      </p>
                    </div>
                  </div>

                  <div
                    className="shadow rounded-lg p-4 flex items-center"
                    style={{ backgroundColor: "#1d1d1d" }}
                  >
                    <div
                      className="p-3 rounded-full mr-4"
                      style={{
                        backgroundColor: "rgba(212, 175, 55, 0.2)",
                        color: "#d4af37",
                      }}
                    >
                      <FaChartLine />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#cccccc" }}>
                        Admins
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#ffffff" }}
                      >
                        {usersLoading
                          ? "—"
                          : users.filter((u) => u.role === "super_admin")
                              .length}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="shadow rounded-lg p-4"
                  style={{ backgroundColor: "#1d1d1d" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-sm font-medium"
                      style={{ color: "#ffffff" }}
                    >
                      Recent users
                    </h3>
                    <a
                      href="/super-admin-dashboard/user-management"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#d4af37" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#b8860b";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#d4af37";
                      }}
                    >
                      Open user management
                    </a>
                  </div>

                  {usersLoading ? (
                    <div
                      className="py-6 text-center text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div
                      className="py-6 text-center text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      No users yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr style={{ borderBottom: "1px solid #2d2d2d" }}>
                            <th
                              className="px-4 py-2 text-left text-xs font-medium uppercase"
                              style={{ color: "#d4af37" }}
                            >
                              User
                            </th>
                            <th
                              className="px-4 py-2 text-left text-xs font-medium uppercase"
                              style={{ color: "#d4af37" }}
                            >
                              Email
                            </th>
                            <th
                              className="px-4 py-2 text-left text-xs font-medium uppercase"
                              style={{ color: "#d4af37" }}
                            >
                              Role
                            </th>
                            <th
                              className="px-4 py-2 text-right text-xs font-medium uppercase"
                              style={{ color: "#d4af37" }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.slice(0, 8).map((u) => (
                            <tr
                              key={u.id}
                              className="transition-colors duration-150"
                              style={{ borderBottom: "1px solid #2d2d2d" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#2d2d2d";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium mr-3"
                                    style={{
                                      backgroundColor: "#2d2d2d",
                                      color: "#ffffff",
                                    }}
                                  >
                                    {(u.name &&
                                      u.name
                                        .split(" ")
                                        .map((p) => p[0])
                                        .slice(0, 2)
                                        .join("")) ||
                                      u.email[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div
                                      className="text-sm font-medium"
                                      style={{ color: "#ffffff" }}
                                    >
                                      {u.name || "—"}
                                    </div>
                                    <div
                                      className="text-xs"
                                      style={{ color: "#999999" }}
                                    >
                                      Joined:{" "}
                                      {new Date(
                                        u.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                className="px-4 py-3 text-sm"
                                style={{ color: "#cccccc" }}
                              >
                                {u.email}
                              </td>
                              <td
                                className="px-4 py-3 text-sm capitalize"
                                style={{ color: "#cccccc" }}
                              >
                                {u.role}
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                <a
                                  href={`/super-admin-dashboard/user-management`}
                                  className="mr-4 transition-colors duration-200"
                                  style={{ color: "#d4af37" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#b8860b";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#d4af37";
                                  }}
                                >
                                  Manage
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
