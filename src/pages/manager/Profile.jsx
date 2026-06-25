import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const ManagerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    store_name: "",
    store_address: "",
    store_logo: null,
    store_contact_number: "",
    store_description: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || userData.role !== "manager") {
      window.location.href = "/login";
      return;
    }

    setUser(userData);

    // Fetch store data
    fetchWithAuth("http://localhost:5000/api/dashboard/store")
      .then((response) => response.json())
      .then((data) => {
        if (data.store) {
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            store_name: data.store.name || "",
            store_address: data.store.address || "",
            store_logo: data.store.logo_url || null,
            store_contact_number: data.store.contact_number || "",
            store_description: data.store.description || "",
          });
        } else {
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            store_name: "",
            store_address: "",
            store_logo: null,
            store_contact_number: "",
            store_description: "",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching store data:", error);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          store_name: "",
          store_address: "",
          store_logo: null,
          store_contact_number: "",
          store_description: "",
        });
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Managers can update their own profile via a different endpoint or skip user update
      // For now, skip user update to avoid 403, as managers shouldn't update user via dashboard/users
      // const userResponse = await fetchWithAuth(
      //   `http://localhost:5000/api/dashboard/users/${user.id}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       name: formData.name,
      //       email: formData.email,
      //     }),
      //   }
      // );

      // const userData = await userResponse.json();
      // if (!userData.message) {
      //   alert(userData.error || "Error updating user profile");
      //   setSaving(false);
      //   return;
      // }

      // Check if store exists - use POST to create, PUT to update
      const storeMethod = formData.store_name ? "PUT" : "POST";
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.store_name);
      formDataToSend.append("address", formData.store_address);
      formDataToSend.append("contact_number", formData.store_contact_number);
      formDataToSend.append("description", formData.store_description);
      if (formData.store_logo && typeof formData.store_logo === 'object') {
        formDataToSend.append("logo", formData.store_logo);
      }

      const storeResponse = await fetchWithAuth(
        "http://localhost:5000/api/dashboard/store",
        {
          method: storeMethod,
          body: formDataToSend,
        }
      );

      // If store exists now, fetch updated data
      if (storeResponse.ok && storeMethod === "POST") {
        const newStoreData = await storeResponse.json();
        if (newStoreData.store) {
          setFormData(prev => ({
            ...prev,
            store_name: newStoreData.store.name || prev.store_name,
            store_address: newStoreData.store.address || prev.store_address,
            store_logo: newStoreData.store.logo_url || null,
            store_contact_number: newStoreData.store.contact_number || prev.store_contact_number,
            store_description: newStoreData.store.description || prev.store_description,
          }));
        }
      }

      const storeData = await storeResponse.json();
      if (storeData.message) {
        // Update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Profile updated successfully!");
      } else {
        alert(storeData.error || "Error updating store");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#ffffff" }}>
        Edit Profile
      </h2>

      <div
        className="shadow rounded-lg p-6"
        style={{ backgroundColor: "#1d1d1d" }}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Name (Read-only)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
                readOnly
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Email (Read-only)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Store Name
              </label>
              <input
                type="text"
                name="store_name"
                value={formData.store_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Store Address
              </label>
              <input
                type="text"
                name="store_address"
                value={formData.store_address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Store Logo
              </label>
              {formData.store_logo && typeof formData.store_logo === 'string' && (
                <div className="mb-2">
                  <p className="text-sm" style={{ color: "#cccccc" }}>
                    Current logo: {formData.store_logo.split("/").pop()}
                  </p>
                  <img
                    src={`http://localhost:5000${formData.store_logo}`}
                    alt="Current store logo"
                    className="w-20 h-20 object-cover rounded border"
                    style={{ borderColor: "#3d3d3d" }}
                  />
                </div>
              )}
              <input
                type="file"
                name="store_logo"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
              />
              {formData.store_logo && typeof formData.store_logo === 'string' && (
                <p className="text-xs mt-1" style={{ color: "#999999" }}>
                  Leave empty to keep current logo
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#ffffff" }}
              >
                Store Contact Number
              </label>
              <input
                type="tel"
                name="store_contact_number"
                value={formData.store_contact_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded transition-colors duration-200"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#3d3d3d";
                }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#ffffff" }}
            >
              Store Description
            </label>
            <textarea
              name="store_description"
              value={formData.store_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 rounded transition-colors duration-200"
              style={{
                backgroundColor: "#2d2d2d",
                color: "#ffffff",
                border: "1px solid #3d3d3d",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#3d3d3d";
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded transition-all duration-200"
              style={{
                backgroundColor: saving ? "#555555" : "#ffffff",
                color: "#000000",
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = "#cccccc";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerProfile;
