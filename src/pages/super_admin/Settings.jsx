import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaImage, FaSave, FaUpload } from "react-icons/fa";

const SuperAdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile_picture: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || userData.role !== "super_admin") {
      navigate("/login");
      return;
    }

    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      profile_picture: userData.profile_picture || "",
    });
    setPreviewUrl(userData.profile_picture || "");
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          const maxSize = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPreviewUrl(resizedDataUrl);
          setFormData({ ...formData, profile_picture: resizedDataUrl });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!previewUrl) return;
    setUploading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/dashboard/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_picture: previewUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile picture updated!" });
        setFormData(prev => ({ ...prev, profile_picture: previewUrl }));
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage({ type: "error", text: data.message || "Failed to upload image" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/dashboard/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/dashboard/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: passwordData.new_password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred" });
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
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }} className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 style={{ color: "#ffffff" }} className="text-3xl font-bold mb-8">
          Account Settings
        </h1>

        {message && (
          <div
            className={`p-4 rounded mb-6 ${
              message.type === "success" ? "bg-green-900" : "bg-red-900"
            }`}
            style={{
              backgroundColor: message.type === "success" ? "#14532d" : "#7f1d1d",
              color: message.type === "success" ? "#bbf7d0" : "#fecaca",
            }}
          >
            {message.text}
          </div>
        )}

        <div
          className="shadow rounded-lg p-6 mb-6"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <h2 style={{ color: "#d4af37" }} className="text-xl font-semibold mb-6">
            Profile Picture
          </h2>

          <div className="flex flex-col items-center mb-6">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
                style={{ border: "3px solid #d4af37" }}
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#2d2d2d", border: "3px solid #d4af37" }}
              >
                <FaUser size={50} style={{ color: "#d4af37" }} />
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="py-2 px-4 rounded font-medium flex items-center gap-2"
                style={{ backgroundColor: "#d4af37", color: "#000000" }}
              >
                <FaUpload />
                Choose Image
              </button>

              <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploading || !previewUrl}
                  className="py-2 px-4 rounded font-medium flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: "#4ecdc4", color: "#000000" }}
                >
                  {uploading ? "Saving..." : "Save Picture"}
                </button>
            </div>
          </div>
        </div>

        <div
          className="shadow rounded-lg p-6 mb-6"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <h2 style={{ color: "#d4af37" }} className="text-xl font-semibold mb-6">
            Profile Information
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#cccccc" }}
              >
                Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3" style={{ color: "#d4af37" }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#cccccc" }}
              >
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  className="absolute left-3 top-3"
                  style={{ color: "#d4af37" }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 rounded font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#d4af37", color: "#000000" }}
            >
              <FaSave />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div
          className="shadow rounded-lg p-6"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <h2 style={{ color: "#d4af37" }} className="text-xl font-semibold mb-6">
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#cccccc" }}
              >
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3" style={{ color: "#d4af37" }} />
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2 rounded"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  placeholder="New password"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#cccccc" }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3" style={{ color: "#d4af37" }} />
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2 rounded"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#ffffff",
                    border: "1px solid #3d3d3d",
                  }}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !passwordData.new_password}
              className="w-full py-2 px-4 rounded font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#d4af37", color: "#000000" }}
            >
              <FaLock />
              {saving ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;