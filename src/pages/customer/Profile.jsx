import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await fetch(
        "http://localhost:5000/api/dashboard/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const updatedData = await response.json();
        toast.success("Profile updated successfully");
        setEditingProfile(false);
        // Update profile state with the new data
        setProfile((prev) => ({
          ...prev,
          user: updatedData.user,
        }));
        // Reset the form
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
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });
      if (response.ok) {
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
          name: "",
          street_address: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          is_default: false,
        });
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
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/profile/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Address deleted successfully");
        fetchProfile();
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Error deleting address");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const cardNumber = paymentForm.card_number.replace(/\s/g, ""); // Remove spaces
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      toast.error("Card number must be between 13 and 19 digits");
      return;
    }

    if (!/^\d+$/.test(cardNumber)) {
      toast.error("Card number must contain only digits");
      return;
    }

    const url = editingPayment
      ? `http://localhost:5000/api/dashboard/profile/payments/${editingPayment.id}`
      : "http://localhost:5000/api/dashboard/profile/payments";
    const method = editingPayment ? "PUT" : "POST";

    const dataToSend = {
      ...paymentForm,
      card_number: cardNumber, // Send cleaned card number
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        toast.success(
          editingPayment
            ? "Payment method updated successfully"
            : "Payment method added successfully"
        );
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentForm({
          cardholder_name: "",
          card_number: "",
          card_type: "",
          expiry_month: "",
          expiry_year: "",
          is_default: false,
        });
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
    setShowPaymentForm(true);
  };

  const handlePaymentDelete = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment method?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/profile/payments/${paymentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Payment method deleted successfully");
        fetchProfile();
      } else {
        toast.error("Failed to delete payment method");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Error deleting payment method");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold text-gray-900">
              Your Profile
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your personal information, addresses, and payment methods
            </p>
          </div>

          {/* Profile Section - FEATURED */}
          <div className="bg-white shadow-2xl rounded-2xl mb-8 transform hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-10 sm:px-10">
              <div className="flex justify-between items-start">
                <div className="flex items-start flex-1">
                  <div className="flex-shrink-0">
                    {profile.user.profile_picture ? (
                      <img
                        key={profile.user.profile_picture}
                        className="h-24 w-24 rounded-full object-cover border-4 border-gray-900 shadow-lg"
                        src={profile.user.profile_picture}
                        alt="Profile"
                        onError={(e) => {
                          e.target.src = "/placeholder-avatar.svg";
                        }}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-gray-900 shadow-lg flex items-center justify-center">
                        <svg
                          className="h-12 w-12 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-6 flex-1">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {profile.user.name || "User"}
                    </h2>
                    <p className="text-gray-600 text-lg mt-1">
                      {profile.user.email}
                    </p>
                    <p className="text-gray-500 text-sm mt-2 capitalize">
                      Member since{" "}
                      {profile.user.created_at
                        ? new Date(profile.user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className={`${
                    editingProfile
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  } px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg`}
                >
                  {editingProfile ? "✕ Cancel" : "✎ Edit Profile"}
                </button>
              </div>

              {editingProfile && (
                <form
                  onSubmit={handleProfileUpdate}
                  className="mt-8 pt-8 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all duration-200"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Profile Picture
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              profile_picture: e.target.files[0],
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                        />
                        {profileForm.profile_picture && (
                          <p className="mt-2 text-sm text-green-600 font-semibold">
                            ✓ {profileForm.profile_picture.name} selected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105"
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-white shadow-2xl rounded-2xl mb-8 border border-gray-200">
            <div className="px-8 py-8 sm:px-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    📍 Delivery Addresses
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage your delivery addresses
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddressForm(!showAddressForm);
                    setEditingAddress(null);
                    setAddressForm({
                      name: "",
                      street_address: "",
                      city: "",
                      state: "",
                      postal_code: "",
                      country: "",
                      is_default: false,
                    });
                  }}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg"
                >
                  {showAddressForm ? "✕ Cancel" : "+ Add Address"}
                </button>
              </div>
              {showAddressForm && (
                <form
                  onSubmit={handleAddressSubmit}
                  className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-300"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Address Label
                      </label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Home, Office"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={addressForm.street_address}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street_address: e.target.value,
                          })
                        }
                        placeholder="123 Main Street"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        placeholder="New York"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                        placeholder="NY"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={addressForm.postal_code}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postal_code: e.target.value,
                          })
                        }
                        placeholder="10001"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            country: e.target.value,
                          })
                        }
                        placeholder="USA"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center">
                      <input
                        type="checkbox"
                        id="default_addr"
                        checked={addressForm.is_default}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            is_default: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-400 text-gray-900 focus:ring-gray-900"
                      />
                      <label
                        htmlFor="default_addr"
                        className="ml-3 text-sm font-semibold text-gray-700"
                      >
                        Set as default delivery address
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                    >
                      ✓ {editingAddress ? "Update Address" : "Save Address"}
                    </button>
                  </div>
                </form>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.addresses.length > 0 ? (
                  profile.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 bg-gray-50 rounded-xl border-l-4 border-gray-900 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {address.name}
                          </h4>
                          {address.is_default && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white mt-2">
                              ★ Default
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-1">
                        {address.street_address}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-gray-600 text-sm">{address.country}</p>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handleAddressEdit(address)}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleAddressDelete(address.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-400">
                    <p className="text-gray-600 text-lg">
                      📭 No addresses yet. Add one to get started!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white shadow-2xl rounded-2xl border border-gray-200">
            <div className="px-8 py-8 sm:px-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    💳 Payment Methods
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Secure payment information
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentForm(!showPaymentForm);
                    setEditingPayment(null);
                    setPaymentForm({
                      cardholder_name: "",
                      card_number: "",
                      card_type: "",
                      expiry_month: "",
                      expiry_year: "",
                      is_default: false,
                    });
                  }}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg"
                >
                  {showPaymentForm ? "✕ Cancel" : "+ Add Card"}
                </button>
              </div>
              {showPaymentForm && (
                <form
                  onSubmit={handlePaymentSubmit}
                  className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-300"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={paymentForm.cardholder_name}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            cardholder_name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentForm.card_number}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            card_number: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none transition-all font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Card Type
                      </label>
                      <select
                        value={paymentForm.card_type}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            card_type: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      >
                        <option value="">Select card type</option>
                        <option value="Visa">🔵 Visa</option>
                        <option value="MasterCard">🔴 MasterCard</option>
                        <option value="American Express">
                          🟡 American Express
                        </option>
                        <option value="Discover">🟢 Discover</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Card Type
                      </label>
                      <select
                        value={paymentForm.card_type}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            card_type: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                        required
                      >
                        <option value="">Select card type</option>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="American Express">
                          American Express
                        </option>
                        <option value="Discover">Discover</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Expiry Month
                        </label>
                        <select
                          value={paymentForm.expiry_month}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              expiry_month: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (month) => (
                              <option key={month} value={month}>
                                {month.toString().padStart(2, "0")}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Expiry Year
                        </label>
                        <select
                          value={paymentForm.expiry_year}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              expiry_year: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                          required
                        >
                          <option value="">YYYY</option>
                          {Array.from(
                            { length: 10 },
                            (_, i) => new Date().getFullYear() + i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex items-center">
                      <input
                        type="checkbox"
                        id="default_payment"
                        checked={paymentForm.is_default}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            is_default: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-400 text-gray-900 focus:ring-gray-900"
                      />
                      <label
                        htmlFor="default_payment"
                        className="ml-3 text-sm font-semibold text-gray-700"
                      >
                        Set as default payment method
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                    >
                      ✓ {editingPayment ? "Update Card" : "Save Card"}
                    </button>
                  </div>
                </form>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.payment_methods.length > 0 ? (
                  profile.payment_methods.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 bg-gray-50 rounded-xl border-l-4 border-gray-900 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {payment.cardholder_name}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {payment.card_type}
                          </p>
                          {payment.is_default && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white mt-2">
                              ★ Default
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-900 text-lg font-mono font-bold">
                        •••• {payment.card_number_last_four}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Expires {payment.expiry_month}/{payment.expiry_year}
                      </p>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handlePaymentEdit(payment)}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handlePaymentDelete(payment.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-400">
                    <p className="text-gray-600 text-lg">
                      💳 No payment methods yet. Add one for faster checkout!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
