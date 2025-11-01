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
        // Update localStorage with the new user data
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...currentUser, ...updatedData.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        fetchProfile();
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Basic Information
                </h3>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  {editingProfile ? "Cancel" : "Edit"}
                </button>
              </div>
              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="mt-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            profile_picture: e.target.files[0],
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={
                        profile.user.profile_picture ||
                        "/placeholder-avatar.svg"
                      }
                      alt="Profile"
                      onError={(e) => {
                        e.target.src = "/placeholder-avatar.svg";
                      }}
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {profile.user.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {profile.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Addresses
                </h3>
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  {showAddressForm ? "Cancel" : "Add Address"}
                </button>
              </div>
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={addressForm.is_default}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              is_default: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Set as default address
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      {editingAddress ? "Update Address" : "Add Address"}
                    </button>
                  </div>
                </form>
              )}
              <div className="mt-4">
                {profile.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {address.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {address.street_address}, {address.city},{" "}
                          {address.state} {address.postal_code},{" "}
                          {address.country}
                        </p>
                        {address.is_default && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddressEdit(address)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAddressDelete(address.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {profile.addresses.length === 0 && !showAddressForm && (
                  <p className="text-sm text-gray-500">
                    No addresses added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Payment Methods
                </h3>
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  {showPaymentForm ? "Cancel" : "Add Payment Method"}
                </button>
              </div>
              {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
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
                        placeholder="Enter full card number"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Month</option>
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
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Year</option>
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
                    <div className="sm:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentForm.is_default}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              is_default: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Set as default payment method
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      {editingPayment
                        ? "Update Payment Method"
                        : "Add Payment Method"}
                    </button>
                  </div>
                </form>
              )}
              <div className="mt-4">
                {profile.payment_methods.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {payment.cardholder_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {payment.card_type} ending in{" "}
                          {payment.card_number_last_four}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {payment.expiry_month}/{payment.expiry_year}
                        </p>
                        {payment.is_default && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePaymentEdit(payment)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePaymentDelete(payment.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {profile.payment_methods.length === 0 && !showPaymentForm && (
                  <p className="text-sm text-gray-500">
                    No payment methods added yet.
                  </p>
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
