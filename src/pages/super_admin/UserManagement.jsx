import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaLock,
  FaUnlock,
  FaPlus,
  FaFilter,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    store_name: "",
    store_address: "",
    store_logo_url: "",
    store_contact_number: "",
    store_description: "",
  });
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(userData);

    fetchUsers();
  }, [currentPage, perPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `http://localhost:5000/api/dashboard/users?page=${currentPage}&per_page=${perPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);

      // Update pagination state
      setCurrentPage(data.pagination?.page || 1);
      setPerPage(data.pagination?.per_page || 10);
      setTotalPages(data.pagination?.pages || 0);
      setTotalItems(data.pagination?.total || 0);
      setHasNext(data.pagination?.has_next || false);
      setHasPrev(data.pagination?.has_prev || false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Pagination functions
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleRoleChange = (userId, role) => {
    fetchWithAuth(`http://localhost:5000/api/dashboard/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Role updated successfully") {
          // Update local state
          setUsers(
            users.map((user) => (user.id === userId ? { ...user, role } : user))
          );
          setEditingUser(null);
          setNewRole("");
          alert("Role updated successfully!");
        } else {
          alert(data.message || "Error updating role");
        }
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        alert("Error updating role");
      });
  };

  const handleLockToggle = () => {
    // Lock/unlock endpoint is not implemented server-side yet.
    // Show an informative message and suggest using role changes or ask to enable lock support.
    alert(
      "Lock/unlock is not available yet. You can delete or change roles instead. If you want lock/unlock, I can add it (requires DB migration)."
    );
  };

  const startEditing = (user) => {
    setEditingUser(user.id);
    setNewRole(user.role);
    // populate editable fields into a temporary area on the users array
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              _editName: u.name || "",
              _editEmail: u.email || "",
              _editPassword: "",
            }
          : u
      )
    );
  };

  const handleSaveEdit = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const payload = {
      name: user._editName,
      email: user._editEmail,
    };
    if (user._editPassword) payload.password = user._editPassword;
    fetchWithAuth(`http://localhost:5000/api/dashboard/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === userId
                ? { ...u, name: payload.name, email: payload.email }
                : u
            )
          );
          setEditingUser(null);
          alert(data.message);
        } else {
          alert(data.error || "Error saving user");
        }
      })
      .catch((err) => {
        console.error("Error saving user:", err);
        alert("Error saving user");
      });
  };

  const handleDeleteUser = (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This cannot be undone."
      )
    )
      return;
    fetchWithAuth(`http://localhost:5000/api/dashboard/users/${userId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          alert(data.message);
        } else {
          alert(data.error || "Error deleting user");
        }
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert("Error deleting user");
      });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    // Restrict creation of manager/admin by non-super-admins
    if (
      currentUser &&
      currentUser.role !== "super_admin" &&
      newUserData.role !== "customer"
    ) {
      alert("Only Super Admin can create Manager or Admin accounts");
      return;
    }
    setCreating(true);
    // If current user is super_admin, call the admin create endpoint to create user with role
    if (currentUser && currentUser.role === "super_admin") {
      fetchWithAuth("http://localhost:5000/api/dashboard/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            // prepend to list
            setUsers((prev) => [data.user, ...(prev || [])]);
            setShowCreateForm(false);
            setNewUserData({
              name: "",
              email: "",
              password: "",
              role: "customer",
              store_name: "",
              store_address: "",
              store_logo_url: "",
              store_contact_number: "",
              store_description: "",
            });
            alert("User created successfully");
          } else {
            throw new Error(data.message || "Error creating user");
          }
        })
        .catch((err) => {
          console.error("Error creating user:", err);
          alert(err.message || "Error creating user");
        })
        .finally(() => setCreating(false));
    } else {
      // Fallback: use public signup for normal customer creation
      fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserData.name,
          email: newUserData.email,
          password: newUserData.password,
        }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.status === 201) {
            alert("User created successfully");
            setShowCreateForm(false);
            setNewUserData({
              name: "",
              email: "",
              password: "",
              role: "customer",
              store_name: "",
              store_address: "",
              store_logo_url: "",
              store_contact_number: "",
              store_description: "",
            });
          } else {
            throw new Error(data.message || "Error creating user");
          }
        })
        .catch((err) => {
          console.error("Error creating user:", err);
          alert(err.message || "Error creating user");
        })
        .finally(() => setCreating(false));
    }
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setNewRole("");
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          User Management
        </h1>

        <div
          className="shadow overflow-hidden sm:rounded-md"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div
            className="px-4 py-5 sm:px-6 border-b"
            style={{ borderColor: "#2d2d2d" }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className="text-lg leading-6 font-medium"
                  style={{ color: "#ffffff" }}
                >
                  Manage Users
                </h3>
                <p
                  className="mt-1 max-w-2xl text-sm"
                  style={{ color: "#999999" }}
                >
                  Manage user roles and permissions
                </p>
              </div>
              {/* Show add user button if current user is manager or super_admin */}
              {currentUser &&
                (currentUser.role === "super_admin" ||
                  currentUser.role === "manager") && (
                  <button
                    onClick={() => setShowCreateForm((s) => !s)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md transition-all duration-200"
                    style={{
                      backgroundColor: "#d4af37",
                      color: "#000000",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#b8860b";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#d4af37";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaPlus className="mr-2" /> Add User
                  </button>
                )}
            </div>

            {showCreateForm && (
              <form
                onSubmit={handleCreateUser}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <input
                  required
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Full name"
                  className="px-3 py-2 rounded transition-colors duration-200"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#d4af37";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#3d3d3d";
                  }}
                />
                <input
                  required
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  type="email"
                  className="px-3 py-2 rounded transition-colors duration-200"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#d4af37";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#3d3d3d";
                  }}
                />
                <input
                  required
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Password"
                  type="password"
                  className="px-3 py-2 rounded transition-colors duration-200"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#d4af37";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#3d3d3d";
                  }}
                />
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, role: e.target.value }))
                  }
                  className="px-3 py-2 rounded transition-colors duration-200"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                >
                  <option value="customer">Customer</option>
                  {/* only super_admin can create manager or super_admin */}
                  {currentUser && currentUser.role === "super_admin" && (
                    <>
                      <option value="manager">Manager</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
                {newUserData.role === "manager" && (
                  <>
                    <input
                      required
                      value={newUserData.store_name}
                      onChange={(e) =>
                        setNewUserData((p) => ({
                          ...p,
                          store_name: e.target.value,
                        }))
                      }
                      placeholder="Store Name"
                      className="px-3 py-2 rounded transition-colors duration-200"
                      style={{
                        backgroundColor: "#2d2d2d",
                        color: "#ffffff",
                        border: "1px solid #3d3d3d",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4af37";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#3d3d3d";
                      }}
                    />
                    <input
                      value={newUserData.store_address}
                      onChange={(e) =>
                        setNewUserData((p) => ({
                          ...p,
                          store_address: e.target.value,
                        }))
                      }
                      placeholder="Store Address"
                      className="px-3 py-2 rounded transition-colors duration-200"
                      style={{
                        backgroundColor: "#2d2d2d",
                        color: "#ffffff",
                        border: "1px solid #3d3d3d",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4af37";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#3d3d3d";
                      }}
                    />
                    <input
                      value={newUserData.store_logo_url}
                      onChange={(e) =>
                        setNewUserData((p) => ({
                          ...p,
                          store_logo_url: e.target.value,
                        }))
                      }
                      placeholder="Store Logo URL"
                      className="px-3 py-2 rounded transition-colors duration-200"
                      style={{
                        backgroundColor: "#2d2d2d",
                        color: "#ffffff",
                        border: "1px solid #3d3d3d",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4af37";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#3d3d3d";
                      }}
                    />
                    <input
                      value={newUserData.store_contact_number}
                      onChange={(e) =>
                        setNewUserData((p) => ({
                          ...p,
                          store_contact_number: e.target.value,
                        }))
                      }
                      placeholder="Store Contact Number"
                      className="px-3 py-2 rounded transition-colors duration-200"
                      style={{
                        backgroundColor: "#2d2d2d",
                        color: "#ffffff",
                        border: "1px solid #3d3d3d",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4af37";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#3d3d3d";
                      }}
                    />
                    <input
                      value={newUserData.store_description}
                      onChange={(e) =>
                        setNewUserData((p) => ({
                          ...p,
                          store_description: e.target.value,
                        }))
                      }
                      placeholder="Store Description"
                      className="px-3 py-2 rounded transition-colors duration-200"
                      style={{
                        backgroundColor: "#2d2d2d",
                        color: "#ffffff",
                        border: "1px solid #3d3d3d",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d4af37";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#3d3d3d";
                      }}
                    />
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <button
                    disabled={creating}
                    type="submit"
                    className="px-3 py-2 rounded transition-all duration-200"
                    style={{
                      backgroundColor: creating ? "#555555" : "#48bb78",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      if (!creating) {
                        e.currentTarget.style.backgroundColor = "#38a169";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!creating) {
                        e.currentTarget.style.backgroundColor = "#48bb78";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 flex items-center space-x-3">
              <FaSearch style={{ color: "#d4af37" }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                  width: "250px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#d4af37";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
              />
            </div>

            <div className="mt-4 flex items-center space-x-3">
              <FaFilter style={{ color: "#d4af37" }} />
              <span className="text-sm" style={{ color: "#cccccc" }}>
                Filter:
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`px-2 py-1 rounded transition-colors duration-200 ${
                    roleFilter === "all" ? "text-white" : "text-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      roleFilter === "all" ? "#d4af37" : "#2d2d2d",
                  }}
                  onMouseEnter={(e) => {
                    if (roleFilter !== "all") {
                      e.currentTarget.style.backgroundColor = "#3d3d3d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (roleFilter !== "all") {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                    }
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setRoleFilter("manager")}
                  className={`px-2 py-1 rounded transition-colors duration-200 ${
                    roleFilter === "manager" ? "text-white" : "text-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      roleFilter === "manager" ? "#d4af37" : "#2d2d2d",
                  }}
                  onMouseEnter={(e) => {
                    if (roleFilter !== "manager") {
                      e.currentTarget.style.backgroundColor = "#3d3d3d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (roleFilter !== "manager") {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                    }
                  }}
                >
                  Managers
                </button>
                <button
                  onClick={() => setRoleFilter("super_admin")}
                  className={`px-2 py-1 rounded transition-colors duration-200 ${
                    roleFilter === "super_admin"
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      roleFilter === "super_admin" ? "#d4af37" : "#2d2d2d",
                  }}
                  onMouseEnter={(e) => {
                    if (roleFilter !== "super_admin") {
                      e.currentTarget.style.backgroundColor = "#3d3d3d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (roleFilter !== "super_admin") {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                    }
                  }}
                >
                  Super Admins
                </button>
                <button
                  onClick={() => setRoleFilter("customer")}
                  className={`px-2 py-1 rounded transition-colors duration-200 ${
                    roleFilter === "customer" ? "text-white" : "text-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      roleFilter === "customer" ? "#d4af37" : "#2d2d2d",
                  }}
                  onMouseEnter={(e) => {
                    if (roleFilter !== "customer") {
                      e.currentTarget.style.backgroundColor = "#3d3d3d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (roleFilter !== "customer") {
                      e.currentTarget.style.backgroundColor = "#2d2d2d";
                    }
                  }}
                >
                  Customers
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: "#2d2d2d" }}>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Store
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Current Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#1d1d1d" }}>
                {users
                  .filter((user) => {
                    const matchesRole =
                      roleFilter === "all" || user.role === roleFilter;
                    const matchesSearch =
                      debouncedSearchTerm === "" ||
                      (user.name &&
                        user.name
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase())) ||
                      (user.email &&
                        user.email
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase()));
                    return matchesRole && matchesSearch;
                  })
                  .map((user, index) => (
                    <tr
                      key={user.id}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid #2d2d2d",
                        backgroundColor:
                          index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1f1f1f";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                      }}
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        style={{ color: "#ffffff" }}
                      >
                        {editingUser === user.id ? (
                          <input
                            value={user._editName}
                            onChange={(e) =>
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, _editName: e.target.value }
                                    : u
                                )
                              )
                            }
                            className="px-2 py-1 rounded w-full transition-colors duration-200"
                            style={{
                              backgroundColor: "#3d3d3d",
                              color: "#ffffff",
                              border: "1px solid #4d4d4d",
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = "#d4af37";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = "#4d4d4d";
                            }}
                          />
                        ) : (
                          user.name || "N/A"
                        )}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {editingUser === user.id ? (
                          <input
                            value={user._editEmail}
                            onChange={(e) =>
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, _editEmail: e.target.value }
                                    : u
                                )
                              )
                            }
                            className="px-2 py-1 rounded w-full transition-colors duration-200"
                            style={{
                              backgroundColor: "#3d3d3d",
                              color: "#ffffff",
                              border: "1px solid #4d4d4d",
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = "#d4af37";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = "#4d4d4d";
                            }}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        {user.store ? user.store.name : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div>
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="block w-full px-3 py-1 rounded text-sm transition-colors duration-200"
                              style={{
                                backgroundColor: "#3d3d3d",
                                color: "#ffffff",
                                border: "1px solid #4d4d4d",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#d4af37";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#4d4d4d";
                              }}
                            >
                              <option value="customer">Customer</option>
                              {currentUser &&
                                currentUser.role === "super_admin" && (
                                  <>
                                    <option value="manager">Manager</option>
                                    <option value="super_admin">
                                      Super Admin
                                    </option>
                                  </>
                                )}
                            </select>
                            <input
                              placeholder="New password (optional)"
                              value={user._editPassword}
                              onChange={(e) =>
                                setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === user.id
                                      ? { ...u, _editPassword: e.target.value }
                                      : u
                                  )
                                )
                              }
                              className="mt-2 px-2 py-1 rounded w-full transition-colors duration-200"
                              type="password"
                              style={{
                                backgroundColor: "#3d3d3d",
                                color: "#ffffff",
                                border: "1px solid #4d4d4d",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#d4af37";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#4d4d4d";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {currentUser &&
                            currentUser.role === "super_admin" ? (
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleRoleChange(user.id, e.target.value)
                                }
                                className="px-2 py-1 rounded text-sm transition-colors duration-200"
                                style={{
                                  backgroundColor: "#3d3d3d",
                                  color: "#ffffff",
                                  border: "1px solid #4d4d4d",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#d4af37";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "#4d4d4d";
                                }}
                              >
                                <option value="customer">Customer</option>
                                <option value="manager">Manager</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === "super_admin"
                                    ? "bg-red-900 text-red-200"
                                    : user.role === "manager"
                                    ? "bg-blue-900 text-blue-200"
                                    : "bg-green-900 text-green-200"
                                }`}
                              >
                                {user.role}
                              </span>
                            )}
                            {/* Lock/Unlock button */}
                            {user.locked ? (
                              <button
                                onClick={() => handleLockToggle(user.id, false)}
                                className="transition-colors duration-200"
                                style={{ color: "#f6e05e" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#ecc94b";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "#f6e05e";
                                }}
                                title="Unlock user"
                              >
                                <FaUnlock />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLockToggle(user.id, true)}
                                className="transition-colors duration-200"
                                style={{ color: "#fc8181" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#f56565";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "#fc8181";
                                }}
                                title="Lock user"
                              >
                                <FaLock />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingUser === user.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                handleSaveEdit(user.id);
                                if (newRole !== user.role)
                                  handleRoleChange(user.id, newRole);
                              }}
                              className="transition-colors duration-200"
                              style={{ color: "#d4af37" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#b8860b";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#d4af37";
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="transition-colors duration-200"
                              style={{ color: "#999999" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#cccccc";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#999999";
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => startEditing(user)}
                              className="transition-colors duration-200"
                              style={{ color: "#d4af37" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#b8860b";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#d4af37";
                              }}
                            >
                              <FaEdit className="inline mr-1" />
                              Edit
                            </button>
                            {currentUser &&
                              currentUser.role === "super_admin" &&
                              currentUser.id !== user.id && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="transition-colors duration-200"
                                  style={{ color: "#fc8181" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#f56565";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#fc8181";
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {users.filter((user) => {
              const matchesRole =
                roleFilter === "all" || user.role === roleFilter;
              const matchesSearch =
                debouncedSearchTerm === "" ||
                (user.name &&
                  user.name
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase())) ||
                (user.email &&
                  user.email
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase()));
              return matchesRole && matchesSearch;
            }).length === 0 && (
              <div className="text-center py-8" style={{ color: "#999999" }}>
                No users found for the selected filter and search term.
              </div>
            )}
          </div>

          {/* Modern Pagination Controls */}
          {totalPages > 1 && (
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 mt-4 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(33,33,33,0.8), rgba(17,17,17,0.95))",
                border: "1px solid #2d2d2d",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">
                    Items per page:
                  </label>
                  <select
                    value={perPage}
                    onChange={(e) =>
                      handlePerPageChange(Number(e.target.value))
                    }
                    className="px-3 py-1 rounded text-sm bg-gray-800 text-white border border-gray-600 focus:border-d4af37 focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="text-sm text-gray-400">
                  Showing {(currentPage - 1) * perPage + 1} to{" "}
                  {Math.min(currentPage * perPage, totalItems)} of {totalItems}{" "}
                  results
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrev}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                    hasPrev
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaChevronLeft /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                          pageNum === currentPage
                            ? "bg-d4af37 text-black"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                    hasNext
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
