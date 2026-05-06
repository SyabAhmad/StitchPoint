import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaCamera, FaEdit, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState({ user: {}, addresses: [], payment_methods: [] });
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", profile_picture: null });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: "", street_address: "", city: "", state: "", postal_code: "", country: "", is_default: false });
  const [paymentForm, setPaymentForm] = useState({ cardholder_name: "", card_number: "", card_type: "", expiry_month: "", expiry_year: "", is_default: false });
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    let storedUser = {};
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        storedUser = JSON.parse(userStr);
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
    fetchProfile(storedUser);
  }, []);

  const fetchProfile = async (storedUser) => {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Defensive checks
        const safeData = data && typeof data === 'object' ? data : {};
        const safeStoredUser = storedUser && typeof storedUser === 'object' ? storedUser : {};
        
        setProfile({ 
          user: safeData?.user || safeData, 
          addresses: safeData?.addresses || [], 
          payment_methods: safeData?.payment_methods || [] 
        });
        
        const userName = safeData?.name || safeStoredUser?.name || "";
        const userEmail = safeData?.email || safeStoredUser?.email || "";
        
        setProfileForm({ 
          name: userName, 
          email: userEmail, 
          profile_picture: null 
        });
      } else {
        toast.error("Failed to fetch profile");
        // Still set loading to false
        setProfile({ user: storedUser || {}, addresses: [], payment_methods: [] });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", profileForm.name || "");
      if (profileForm.profile_picture) {
        formData.append("profile_picture", profileForm.profile_picture);
      }

      const response = await fetch("http://localhost:5000/api/dashboard/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const updatedData = await response.json();
        toast.success("Profile updated successfully");
        setEditingProfile(false);
        
        const userToSave = updatedData?.user || updatedData || {};
        setProfile((prev) => ({ ...prev, user: userToSave }));
        
        // Update localStorage for dashboard to read
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.profile_picture = userToSave.profile_picture;
        storedUser.name = userToSave.name;
        localStorage.setItem("user", JSON.stringify(storedUser));
        
        setProfileForm((prev) => ({ ...prev, profile_picture: null }));
        // Refetch profile
        const storedUserF = JSON.parse(localStorage.getItem("user") || {});
        fetchProfile(storedUserF);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileForm((prev) => ({ ...prev, profile_picture: file }));
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingAddress 
        ? `http://localhost:5000/api/dashboard/profile/addresses/${editingAddress}`
        : "http://localhost:5000/api/dashboard/profile/addresses";
      const response = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (response.ok) {
        toast.success(editingAddress ? "Address updated" : "Address added");
        setShowAddressForm(false);
        setAddressForm({ name: "", street_address: "", city: "", state: "", postal_code: "", country: "", is_default: false });
        setEditingAddress(null);
        // Refetch profile
        const storedUser = JSON.parse(localStorage.getItem("user") || {});
        fetchProfile(storedUser);
      } else toast.error("Failed to save address");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Error saving address");
    }
  };

  const handlePaymentSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/profile/payments", {
        method: editingPayment ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editingPayment ? { ...paymentForm, id: editingPayment } : paymentForm),
      });
      if (response.ok) {
        toast.success(editingPayment ? "Payment updated" : "Payment added");
        setShowPaymentForm(false);
        setPaymentForm({ cardholder_name: "", card_number: "", card_type: "", expiry_month: "", expiry_year: "", is_default: false });
        setEditingPayment(null);
        // Refetch profile
        const storedUser = JSON.parse(localStorage.getItem("user") || {});
        fetchProfile(storedUser);
      } else toast.error("Failed to save payment");
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Error saving payment");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/dashboard/profile/${type === "address" ? "addresses" : "payments"}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success(`${type} deleted`);
        // Refetch profile
        const storedUser = JSON.parse(localStorage.getItem("user") || {});
        fetchProfile(storedUser);
      } else toast.error(`Failed to delete ${type}`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Error deleting ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fafafa" }}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#d4af37" }}></div>
        </div>
      </div>
    );
  }

  const userData = profile?.user || {};

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafafa" }}>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: '"Playfair Display", serif', color: "#1a1a1a" }}>
          Your Profile
        </h1>
        <p className="mb-8" style={{ color: "#666" }}>Manage your personal information</p>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32" style={{ backgroundColor: "#1a1a1a" }}></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center justify-between -mt-16 mb-6 gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg" style={{ backgroundColor: "#f5f5f5" }}>
                    {userData?.profile_picture || profileForm.profile_picture ? (
                      <img
                        src={profileForm.profile_picture ? URL.createObjectURL(profileForm.profile_picture) : getImageUrl(userData?.profile_picture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { console.error("Image load error:", e.target.src); e.target.style.display='none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><FaUser className="text-4xl" style={{ color: "#666" }} /></div>
                    )}
                  </div>
                  {editingProfile && (
                    <label className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer shadow-lg transition-colors" style={{ backgroundColor: "#d4af37", color: "#000" }}>
                      <FaCamera />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm" style={{ color: "#888" }}>Welcome back,</p>
                  <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#1a1a1a" }}>
                    {userData?.name || "Guest"}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "#666" }}>{userData?.email}</p>
                  {userData?.created_at && (
                    <p className="text-sm mt-1" style={{ color: "#888" }}>
                      Member since {new Date(userData.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setEditingProfile(!editingProfile); setProfileForm({ name: userData?.name || "", email: userData?.email || "", profile_picture: null }); }}
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: editingProfile ? "#dc3545" : "#1a1a1a", color: "#fff" }}
              >
                {editingProfile ? <><FaTimes className="inline mr-2" />Cancel</> : <><FaEdit className="inline mr-2" />Edit Profile</>}
              </button>
            </div>

            {editingProfile && (
              <form onSubmit={handleProfileUpdate} className="border-t pt-6" style={{ borderColor: "#e5e5e5" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#333" }}>Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#999" }} />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#d4af37]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#333" }}>Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#999" }} />
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#666" }}>Contact support to change email</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="mt-6 px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#d4af37", color: "#000" }}
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="px-8 py-6 flex justify-between items-center border-b" style={{ borderColor: "#e5e5e5" }}>
            <h3 className="text-xl font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#1a1a1a" }}>Addresses</h3>
            <button
              onClick={() => { setShowAddressForm(!showAddressForm); setEditingAddress(null); setAddressForm({ name: "", street_address: "", city: "", state: "", postal_code: "", country: "", is_default: false }); }}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: "#1a1a1a", color: "#fff" }}
            >
              <FaPlus /> Add
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddressSave} className="p-6 border-b" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Label (Home, Office)" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <input type="text" placeholder="Street Address" value={addressForm.street_address} onChange={(e) => setAddressForm({ ...addressForm, street_address: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <input type="text" placeholder="State/Province" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <input type="text" placeholder="Postal Code" value={addressForm.postal_code} onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <input type="text" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="px-4 py-3 border rounded-lg" required />
              </div>
              <label className="flex items-center gap-2 mt-4">
                <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })} />
                <span style={{ color: "#333" }}>Set as default</span>
              </label>
              <div className="mt-4 flex gap-3">
                <button type="submit" className="px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: "#d4af37", color: "#000" }}>Save Address</button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 rounded-lg font-medium border" style={{ borderColor: "#ddd", color: "#333" }}>Cancel</button>
              </div>
            </form>
          )}

          <div className="p-6">
            {profile?.addresses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.addresses.map((address) => (
                  <div key={address.id} className="p-4 rounded-xl border" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold" style={{ color: "#1a1a1a" }}>{address.name}</p>
                        <p className="text-sm mt-1" style={{ color: "#666" }}>{address.street_address}</p>
                        <p className="text-sm" style={{ color: "#666" }}>{address.city}, {address.state} {address.postal_code}</p>
                        <p className="text-sm" style={{ color: "#666" }}>{address.country}</p>
                        {address.is_default && (
                          <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: "#d4af37", color: "#000" }}>Default</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => { setEditingAddress(address.id); setAddressForm({ name: address.name, street_address: address.street_address, city: address.city, state: address.state, postal_code: address.postal_code, country: address.country, is_default: address.is_default }); setShowAddressForm(true); }} className="text-sm" style={{ color: "#666" }}>Edit</button>
                        <button onClick={() => handleDelete("address", address.id)} className="text-sm" style={{ color: "#dc3545" }}><FaTrash /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: "#999" }}>No addresses saved yet</p>
            )}
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="px-8 py-6 flex justify-between items-center border-b" style={{ borderColor: "#e5e5e5" }}>
            <h3 className="text-xl font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#1a1a1a" }}>Payment Methods</h3>
            <button
              onClick={() => { setShowPaymentForm(!showPaymentForm); setEditingPayment(null); setPaymentForm({ cardholder_name: "", card_number: "", card_type: "", expiry_month: "", expiry_year: "", is_default: false }); }}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: "#1a1a1a", color: "#fff" }}
            >
              <FaPlus /> Add
            </button>
          </div>

          {showPaymentForm && (
            <form onSubmit={handlePaymentSave} className="p-6 border-b" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Cardholder Name" value={paymentForm.cardholder_name} onChange={(e) => setPaymentForm({ ...paymentForm, cardholder_name: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <input type="text" placeholder="Card Number" value={paymentForm.card_number} onChange={(e) => setPaymentForm({ ...paymentForm, card_number: e.target.value })} className="px-4 py-3 border rounded-lg" required />
                <select value={paymentForm.card_type} onChange={(e) => setPaymentForm({ ...paymentForm, card_type: e.target.value })} className="px-4 py-3 border rounded-lg" required>
                  <option value="">Select Card Type</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                </select>
                <div className="flex gap-2">
                  <input type="text" placeholder="MM" value={paymentForm.expiry_month} onChange={(e) => setPaymentForm({ ...paymentForm, expiry_month: e.target.value })} className="px-4 py-3 border rounded-lg w-24" required />
                  <input type="text" placeholder="YY" value={paymentForm.expiry_year} onChange={(e) => setPaymentForm({ ...paymentForm, expiry_year: e.target.value })} className="px-4 py-3 border rounded-lg w-24" required />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4">
                <input type="checkbox" checked={paymentForm.is_default} onChange={(e) => setPaymentForm({ ...paymentForm, is_default: e.target.checked })} />
                <span style={{ color: "#333" }}>Set as default</span>
              </label>
              <div className="mt-4 flex gap-3">
                <button type="submit" className="px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: "#d4af37", color: "#000" }}>Save Payment</button>
                <button type="button" onClick={() => setShowPaymentForm(false)} className="px-6 py-2 rounded-lg font-medium border" style={{ borderColor: "#ddd", color: "#333" }}>Cancel</button>
              </div>
            </form>
          )}

          <div className="p-6">
            {profile?.payment_methods?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.payment_methods.map((payment) => (
                  <div key={payment.id} className="p-4 rounded-xl border" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold" style={{ color: "#1a1a1a" }}>{payment.cardholder_name}</p>
                        <p className="text-sm mt-2 font-mono" style={{ color: "#666" }}>**** **** **** {payment.card_number?.slice(-4)}</p>
                        <p className="text-sm" style={{ color: "#666" }}>{payment.card_type?.toUpperCase()} • {payment.expiry_month}/{payment.expiry_year}</p>
                        {payment.is_default && (
                          <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: "#d4af37", color: "#000" }}>Default</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => { setEditingPayment(payment.id); setPaymentForm({ cardholder_name: payment.cardholder_name, card_number: payment.card_number, card_type: payment.card_type, expiry_month: payment.expiry_month, expiry_year: payment.expiry_year, is_default: payment.is_default }); setShowPaymentForm(true); }} className="text-sm" style={{ color: "#666" }}>Edit</button>
                        <button onClick={() => handleDelete("payment", payment.id)} className="text-sm" style={{ color: "#dc3545" }}><FaTrash /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: "#999" }}>No payment methods saved yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;