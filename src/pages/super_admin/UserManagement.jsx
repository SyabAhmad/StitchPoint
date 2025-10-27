import React, { useState, useEffect } from "react";
import { FaEdit, FaLock, FaUnlock, FaPlus } from "react-icons/fa";

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
  });
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(userData);

    fetch("http://localhost:5000/api/dashboard/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleRoleChange = (userId, role) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/dashboard/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

  const handleLockToggle = (userId, locked) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/dashboard/users/${userId}/lock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ locked }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUsers(users.map((u) => (u.id === userId ? { ...u, locked } : u)));
          alert(data.message);
        } else {
          alert(data.error || "Error updating lock state");
        }
      })
      .catch((err) => {
        console.error("Error locking/unlocking user:", err);
        alert("Error updating lock state");
      });
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
    const token = localStorage.getItem("token");
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const payload = {
      name: user._editName,
      email: user._editEmail,
    };
    if (user._editPassword) payload.password = user._editPassword;
    fetch(`http://localhost:5000/api/dashboard/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    // Use the public signup endpoint to create the account, then (if needed)
    // elevate role using the dashboard role endpoint (super_admin only).
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
          // If super_admin requested a manager/super_admin account, elevate it now
          if (
            newUserData.role &&
            newUserData.role !== "customer" &&
            currentUser &&
            currentUser.role === "super_admin"
          ) {
            // fetch users list and find new user by email
            const token2 = localStorage.getItem("token");
            return fetch("http://localhost:5000/api/dashboard/users", {
              headers: { Authorization: `Bearer ${token2}` },
            })
              .then((r) => r.json())
              .then((usersData) => {
                const created = (usersData.users || []).find(
                  (u) => u.email === newUserData.email
                );
                if (created) {
                  return fetch(
                    `http://localhost:5000/api/dashboard/users/${created.id}/role`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token2}`,
                      },
                      body: JSON.stringify({ role: newUserData.role }),
                    }
                  )
                    .then((r) => r.json())
                    .then((roleResp) => ({ created, roleResp }));
                }
                return { created: null };
              });
          }
          return { created: true };
        } else {
          throw new Error(data.message || "Error creating user");
        }
      })
      .then(() => {
        // Refresh users list (super_admin only endpoint) to show newly created user
        const token3 = localStorage.getItem("token");
        if (token3) {
          fetch("http://localhost:5000/api/dashboard/users", {
            headers: { Authorization: `Bearer ${token3}` },
          })
            .then((r) => r.json())
            .then((usersData) => {
              setUsers(usersData.users || []);
              setShowCreateForm(false);
              setNewUserData({
                name: "",
                email: "",
                password: "",
                role: "customer",
              });
              alert("User created successfully");
            })
            .catch((err) => {
              console.error("Error fetching users after creation:", err);
              alert("User created but failed to refresh users list");
            })
            .finally(() => setCreating(false));
        } else {
          setCreating(false);
        }
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        alert(err.message || "Error creating user");
        setCreating(false);
      });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setNewRole("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          User Management
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Manage Users
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage user roles and permissions
            </p>
            <div className="mt-4 flex items-center justify-end">
              {/* Show add user button if current user is manager or super_admin */}
              {currentUser &&
                (currentUser.role === "super_admin" ||
                  currentUser.role === "manager") && (
                  <button
                    onClick={() => setShowCreateForm((s) => !s)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <FaPlus className="mr-2" /> Add User
                  </button>
                )}
            </div>
            {showCreateForm && (
              <form
                onSubmit={handleCreateUser}
                className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <input
                  required
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Full name"
                  className="px-3 py-2 border rounded"
                />
                <input
                  required
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  type="email"
                  className="px-3 py-2 border rounded"
                />
                <input
                  required
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Password"
                  type="password"
                  className="px-3 py-2 border rounded"
                />
                <div className="flex items-center space-x-2">
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData((p) => ({ ...p, role: e.target.value }))
                    }
                    className="px-3 py-2 border rounded"
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
                  <button
                    disabled={creating}
                    type="submit"
                    className="px-3 py-2 bg-green-600 text-white rounded"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
                <div className="mt-4 flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Filter:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setRoleFilter("all")}
                      className={`px-2 py-1 rounded ${
                        roleFilter === "all"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setRoleFilter("manager")}
                      className={`px-2 py-1 rounded ${
                        roleFilter === "manager"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      Managers
                    </button>
                    <button
                      onClick={() => setRoleFilter("super_admin")}
                      className={`px-2 py-1 rounded ${
                        roleFilter === "super_admin"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      Super Admins
                    </button>
                    <button
                      onClick={() => setRoleFilter("customer")}
                      className={`px-2 py-1 rounded ${
                        roleFilter === "customer"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      Customers
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users
                  .filter((user) =>
                    roleFilter === "all" ? true : user.role === roleFilter
                  )
                  .map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                            className="px-2 py-1 border rounded w-full"
                          />
                        ) : (
                          user.name || "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                            className="px-2 py-1 border rounded w-full"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div>
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                              className="mt-2 px-2 py-1 border rounded w-full"
                              type="password"
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
                                className="px-2 py-1 border rounded text-sm"
                              >
                                <option value="customer">Customer</option>
                                <option value="manager">Manager</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === "super_admin"
                                    ? "bg-red-100 text-red-800"
                                    : user.role === "manager"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            )}
                            {/* Lock/Unlock button */}
                            {user.locked ? (
                              <button
                                onClick={() => handleLockToggle(user.id, false)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Unlock user"
                              >
                                <FaUnlock />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLockToggle(user.id, true)}
                                className="text-red-600 hover:text-red-900"
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
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => startEditing(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEdit className="inline mr-1" />
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
