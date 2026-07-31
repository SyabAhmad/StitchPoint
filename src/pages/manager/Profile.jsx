import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import toast from "react-hot-toast";

const ManagerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", store_name: "", store_address: "", store_logo: null,
    store_contact_number: "", store_description: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || userData.role !== "manager") { window.location.href = "/login"; return; }
    setUser(userData);

    fetchWithAuth("http://localhost:5000/api/dashboard/store")
      .then((response) => response.json())
      .then((data) => {
        if (data.store) {
          setFormData({
            name: userData.name || "", email: userData.email || "",
            store_name: data.store.name || "", store_address: data.store.address || "",
            store_logo: null, store_contact_number: data.store.contact_number || "",
            store_description: data.store.description || "",
          });
        } else {
          setFormData({ name: userData.name || "", email: userData.email || "", store_name: "", store_address: "", store_logo: null, store_contact_number: "", store_description: "" });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching store data:", error);
        setFormData({ name: userData.name || "", email: userData.email || "", store_name: "", store_address: "", store_logo: null, store_contact_number: "", store_description: "" });
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") { setFormData((prev) => ({ ...prev, [name]: files[0] })); }
    else { setFormData((prev) => ({ ...prev, [name]: value })); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.store_name);
      formDataToSend.append("address", formData.store_address);
      formDataToSend.append("contact_number", formData.store_contact_number);
      formDataToSend.append("description", formData.store_description);
      if (formData.store_logo) { formDataToSend.append("logo", formData.store_logo); }

      const storeResponse = await fetchWithAuth("http://localhost:5000/api/dashboard/store", {
        method: "PUT", body: formDataToSend,
      });
      const storeData = await storeResponse.json();
      if (storeData.message) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(storeData.error || "Error updating store");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-3"></div>
          <span className="text-white/40 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all";

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gold-500 mb-6">Edit Profile</h2>

      <div className="bg-[#111] border border-white/5 rounded-lg p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Name (Read-only)</label>
              <input type="text" name="name" value={formData.name} readOnly className={`${inputClass} opacity-50 cursor-not-allowed`} />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Email (Read-only)</label>
              <input type="email" name="email" value={formData.email} readOnly className={`${inputClass} opacity-50 cursor-not-allowed`} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Store Name</label>
              <input type="text" name="store_name" value={formData.store_name} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Store Address</label>
              <input type="text" name="store_address" value={formData.store_address} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Store Logo</label>
              {user && user.store_logo && typeof user.store_logo === "string" && (
                <div className="mb-2">
                  <p className="text-xs text-white/30 mb-1">Current logo: {user.store_logo.split("/").pop()}</p>
                  <img src={`http://localhost:5000${user.store_logo}`} alt="Current store logo" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                </div>
              )}
              <input type="file" name="store_logo" accept="image/*" onChange={handleInputChange} className={inputClass} />
              {user && user.store_logo && <p className="text-[10px] text-white/20 mt-1">Leave empty to keep current logo</p>}
            </div>
            <div>
              <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Store Contact Number</label>
              <input type="tel" name="store_contact_number" value={formData.store_contact_number} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-1.5">Store Description</label>
            <textarea name="store_description" value={formData.store_description} onChange={handleInputChange} rows={4} className={inputClass} />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="px-6 py-2 bg-gold-500 text-black text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-40">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerProfile;
