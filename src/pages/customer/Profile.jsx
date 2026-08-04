import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const Profile = () => {
  const [profile, setProfile] = useState({
    user: {},
    addresses: [],
    payment_methods: [],
  });
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    profile_picture: null,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardholder_name: "",
    card_number: "",
    card_type: "",
    expiry_month: "",
    expiry_year: "",
    is_default: false,
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentErrors, setPaymentErrors] = useState({});

  const CARD_TYPE_PREFIXES = {
    Visa: /^4/,
    MasterCard: /^(5[1-5]|2[2-7])/,
    "American Express": /^3[47]/,
    Discover: /^(6011|65)/,
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const updatePaymentField = (key, value) => {
    setPaymentForm((prev) => ({ ...prev, [key]: value }));
    setPaymentErrors({});
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetchWithAuth("http://localhost:5000/api/dashboard/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          name: data.user.name,
          email: data.user.email,
          profile_picture: null,
        });
      } else {
        toast.error("Failed to fetch profile");
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
    const formData = new FormData();
    formData.append("name", profileForm.name);
    formData.append("email", profileForm.email);
    if (profileForm.profile_picture) {
      formData.append("profile_picture", profileForm.profile_picture);
    }

    try {
      const response = await fetchWithAuth("http://localhost:5000/api/dashboard/profile", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const updatedData = await response.json();
        toast.success("Profile updated successfully");
        setEditingProfile(false);
        setProfile((prev) => ({ ...prev, user: updatedData.user }));
        setProfileForm({
          name: updatedData.user.name,
          email: updatedData.user.email,
          profile_picture: null,
        });
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const url = editingAddress
      ? `http://localhost:5000/api/dashboard/profile/addresses/${editingAddress.id}`
      : "http://localhost:5000/api/dashboard/profile/addresses";
    const method = editingAddress ? "PUT" : "POST";

    try {
      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (response.ok) {
        toast.success(editingAddress ? "Address updated" : "Address added");
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({ name: "", street_address: "", city: "", state: "", postal_code: "", country: "", is_default: false });
        fetchProfile();
      } else {
        toast.error("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Error saving address");
    }
  };

  const handleAddressEdit = (address) => {
    setAddressForm({
      name: address.name,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddressDelete = async (addressId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Delete this address?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetchWithAuth(`http://localhost:5000/api/dashboard/profile/addresses/${addressId}`, { method: "DELETE" });
                if (response.ok) {
                  toast.success("Address deleted");
                  fetchProfile();
                } else {
                  toast.error("Failed to delete address");
                }
              } catch {
                toast.error("Error deleting address");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Delete
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const now = new Date();

    const cardholderName = paymentForm.cardholder_name.trim();
    if (!cardholderName) {
      errors.cardholder_name = "Cardholder name is required";
    } else if (cardholderName.length < 3) {
      errors.cardholder_name = "Cardholder name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(cardholderName)) {
      errors.cardholder_name = "Cardholder name can only contain letters";
    }

    const cardNumber = paymentForm.card_number.replace(/\s/g, "");
    if (!cardNumber) {
      errors.card_number = "Card number is required";
    } else if (!/^\d+$/.test(cardNumber)) {
      errors.card_number = "Card number must contain only digits";
    } else if (cardNumber.length < 13) {
      errors.card_number = `Card number is too short — must be at least 13 digits (${cardNumber.length} entered)`;
    } else if (cardNumber.length > 19) {
      errors.card_number = `Card number is too long — must be at most 19 digits (${cardNumber.length} entered)`;
    } else if (
      paymentForm.card_type &&
      CARD_TYPE_PREFIXES[paymentForm.card_type] &&
      !CARD_TYPE_PREFIXES[paymentForm.card_type].test(cardNumber)
    ) {
      errors.card_number = `Card number does not match ${paymentForm.card_type} format`;
    }

    if (!paymentForm.card_type) {
      errors.card_type = "Please select a card type";
    }

    if (!paymentForm.expiry_month) {
      errors.expiry_month = "Select a month";
    }
    if (!paymentForm.expiry_year) {
      errors.expiry_year = "Select a year";
    }
    const expYear = Number(paymentForm.expiry_year);
    const expMonth = Number(paymentForm.expiry_month);
    if (expYear && expMonth) {
      if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
        errors.expiry_year = "Card has expired";
      }
    }

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      toast.error("Please fix the highlighted card details");
      return;
    }
    setPaymentErrors({});

    const url = editingPayment
      ? `http://localhost:5000/api/dashboard/profile/payments/${editingPayment.id}`
      : "http://localhost:5000/api/dashboard/profile/payments";
    const method = editingPayment ? "PUT" : "POST";

    try {
      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...paymentForm, card_number: cardNumber }),
      });
      if (response.ok) {
        toast.success(editingPayment ? "Payment method updated" : "Payment method added");
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentForm({ cardholder_name: "", card_number: "", card_type: "", expiry_month: "", expiry_year: "", is_default: false });
        fetchProfile();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save payment method");
      }
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast.error("Error saving payment method");
    }
  };

  const handlePaymentEdit = (payment) => {
    setPaymentForm({
      cardholder_name: payment.cardholder_name,
      card_number: "",
      card_type: payment.card_type,
      expiry_month: payment.expiry_month,
      expiry_year: payment.expiry_year,
      is_default: payment.is_default,
    });
    setEditingPayment(payment);
    setPaymentErrors({});
    setShowPaymentForm(true);
  };

  const handlePaymentDelete = async (paymentId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Delete this payment method?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetchWithAuth(`http://localhost:5000/api/dashboard/profile/payments/${paymentId}`, { method: "DELETE" });
                if (response.ok) {
                  toast.success("Payment method deleted");
                  fetchProfile();
                } else {
                  toast.error("Failed to delete payment method");
                }
              } catch {
                toast.error("Error deleting payment method");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Delete
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-500 mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors";

  const fieldClass = (field) =>
    paymentErrors[field]
      ? "w-full px-4 py-2.5 bg-red-50 border border-red-400 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-400 outline-none transition-colors"
      : inputClass;

  const fieldError = (field) =>
    paymentErrors[field] ? (
      <p className="mt-1 text-xs text-red-500">{paymentErrors[field]}</p>
    ) : null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600 mb-1">Account</p>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information, addresses, and payment methods</p>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className="h-20 bg-gradient-to-r from-gold-500/25 via-gold-500/10 to-gold-500/5 border-b border-gray-100" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              {profile.user.profile_picture ? (
                <img
                  key={profile.user.profile_picture}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
                  src={profile.user.profile_picture}
                  alt="Profile"
                  onError={(e) => { e.target.src = "/placeholder-avatar.svg"; }}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 ring-4 ring-white shadow-md flex items-center justify-center">
                  <FaUser className="text-gray-400 text-2xl" />
                </div>
              )}
              <div className="pb-0.5">
                <h2 className="text-xl font-bold text-gray-900">{profile.user.name || "User"}</h2>
                <p className="text-sm text-gray-500">{profile.user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Member since{" "}
                  {profile.user.created_at
                    ? new Date(profile.user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                editingProfile
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {editingProfile ? <><FaTimes className="inline mr-1" /> Cancel</> : <><FaEdit className="inline mr-1" /> Edit Profile</>}
            </button>
          </div>

          {editingProfile && (
            <form onSubmit={handleProfileUpdate} className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={inputClass}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileForm({ ...profileForm, profile_picture: e.target.files[0] })}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-600 cursor-pointer"
                  />
                  {profileForm.profile_picture && (
                    <p className="mt-1 text-xs text-green-600">{profileForm.profile_picture.name} selected</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors flex items-center gap-2">
                  <FaCheck /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-gold-500/10 text-gold-600 flex items-center justify-center">
              <FaMapMarkerAlt />
            </span>
            <div>
              <h3 className="font-bold text-gray-900">Delivery Addresses</h3>
              <p className="text-xs text-gray-500 mt-0.5">Manage your delivery addresses</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddressForm(!showAddressForm);
              setEditingAddress(null);
              setAddressForm({ name: "", street_address: "", city: "", state: "", postal_code: "", country: "", is_default: false });
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors"
          >
            {showAddressForm ? <><FaTimes className="inline mr-1" /> Cancel</> : <><FaPlus className="inline mr-1" /> Add Address</>}
          </button>
        </div>

        <div className="p-6">
          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Label</label>
                  <input type="text" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} placeholder="e.g., Home, Office" className={inputClass} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input type="text" value={addressForm.street_address} onChange={(e) => setAddressForm({ ...addressForm, street_address: e.target.value })} placeholder="123 Main Street" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="Lahore" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="Punjab" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input type="text" value={addressForm.postal_code} onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })} placeholder="54000" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input type="text" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} placeholder="Pakistan" className={inputClass} required />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default_addr"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor="default_addr" className="text-sm text-gray-700">Set as default delivery address</label>
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors flex items-center gap-2">
                  <FaCheck /> {editingAddress ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.addresses.length > 0 ? (
              profile.addresses.map((address) => (
                <div key={address.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-gold-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{address.name}</h4>
                      {address.is_default && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gold-500 text-black mt-1">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{address.street_address}</p>
                  <p className="text-sm text-gray-500">{address.city}, {address.state} {address.postal_code}</p>
                  <p className="text-sm text-gray-500">{address.country}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleAddressEdit(address)} className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors">
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button onClick={() => handleAddressDelete(address.id)} className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center border border-dashed border-gray-300 rounded-lg">
                <FaMapMarkerAlt className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No addresses yet. Add one to get started!</p>
              </div>
            )}
          </div>
          </div>
        </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-gold-500/10 text-gold-600 flex items-center justify-center">
              <FaCreditCard />
            </span>
            <div>
              <h3 className="font-bold text-gray-900">Payment Methods</h3>
              <p className="text-xs text-gray-500 mt-0.5">Secure payment information</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowPaymentForm(!showPaymentForm);
              setEditingPayment(null);
              setPaymentErrors({});
              setPaymentForm({ cardholder_name: "", card_number: "", card_type: "", expiry_month: "", expiry_year: "", is_default: false });
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors"
          >
            {showPaymentForm ? <><FaTimes className="inline mr-1" /> Cancel</> : <><FaPlus className="inline mr-1" /> Add Card</>}
          </button>
        </div>

        <div className="p-6">
          {showPaymentForm && (
            <form onSubmit={handlePaymentSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={paymentForm.cardholder_name}
                    onChange={(e) => updatePaymentField("cardholder_name", e.target.value)}
                    placeholder="John Doe"
                    className={fieldClass("cardholder_name")}
                    maxLength={60}
                  />
                  {fieldError("cardholder_name")}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={paymentForm.card_number}
                    onChange={(e) => updatePaymentField("card_number", formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    className={`${fieldClass("card_number")} font-mono`}
                    maxLength={23}
                  />
                  {fieldError("card_number")}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                  <select
                    value={paymentForm.card_type}
                    onChange={(e) => updatePaymentField("card_type", e.target.value)}
                    className={fieldClass("card_type")}
                  >
                    <option value="">Select card type</option>
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                  {fieldError("card_type")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Month</label>
                    <select
                      value={paymentForm.expiry_month}
                      onChange={(e) => updatePaymentField("expiry_month", e.target.value)}
                      className={fieldClass("expiry_month")}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>{month.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                    {fieldError("expiry_month")}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Year</label>
                    <select
                      value={paymentForm.expiry_year}
                      onChange={(e) => updatePaymentField("expiry_year", e.target.value)}
                      className={fieldClass("expiry_year")}
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {fieldError("expiry_year")}
                  </div>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default_payment"
                    checked={paymentForm.is_default}
                    onChange={(e) => setPaymentForm({ ...paymentForm, is_default: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor="default_payment" className="text-sm text-gray-700">Set as default payment method</label>
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-black hover:bg-gold-600 transition-colors flex items-center gap-2">
                  <FaCheck /> {editingPayment ? "Update Card" : "Save Card"}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.payment_methods.length > 0 ? (
              profile.payment_methods.map((payment) => (
                <div key={payment.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-gold-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{payment.cardholder_name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{payment.card_type}</p>
                      {payment.is_default && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gold-500 text-black mt-1">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-mono font-bold text-gray-900">**** **** **** {payment.card_number_last_four}</p>
                  <p className="text-xs text-gray-500 mt-1">Expires {payment.expiry_month}/{payment.expiry_year}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handlePaymentEdit(payment)} className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors">
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button onClick={() => handlePaymentDelete(payment.id)} className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center border border-dashed border-gray-300 rounded-lg">
                <FaCreditCard className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No payment methods yet. Add one for faster checkout!</p>
              </div>
            )}
          </div>
          </div>
        </div>
    </div>
  );
};

export default Profile;
