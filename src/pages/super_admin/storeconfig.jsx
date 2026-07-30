import React, { useState, useEffect } from "react";
import {
  FaStore,
  FaSave,
  FaTimes,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";

const StoreConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    currency: "PKR",
    tax_rate: 0,
    shipping_cost: 0,
    free_shipping_threshold: 0,
    return_policy: "",
    privacy_policy: "",
    terms_of_service: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: "",
    enabled: true,
  });
  const [newShippingMethod, setNewShippingMethod] = useState({
    name: "",
    cost: 0,
    enabled: true,
  });

  useEffect(() => {
    const fetchStoreConfig = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/store-config", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch store configuration");
        }

        const data = await response.json();
        setStoreSettings(data.store_settings || storeSettings);
        setPaymentMethods(data.payment_methods || []);
        setShippingMethods(data.shipping_methods || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching store configuration:", error);
        toast.error("Failed to load store configuration");
        setLoading(false);
      }
    };

    fetchStoreConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setStoreSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/store-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          store_settings: storeSettings,
          payment_methods: paymentMethods,
          shipping_methods: shippingMethods,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save store configuration");
      }

      toast.success("Store configuration saved successfully");
      setEditing(false);
      setSaving(false);
    } catch (error) {
      console.error("Error saving store configuration:", error);
      toast.error("Failed to save store configuration");
      setSaving(false);
    }
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.name.trim()) {
      setPaymentMethods([
        ...paymentMethods,
        { ...newPaymentMethod, id: Date.now() },
      ]);
      setNewPaymentMethod({ name: "", enabled: true });
    }
  };

  const handleDeletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const handleTogglePaymentMethod = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleAddShippingMethod = () => {
    if (newShippingMethod.name.trim()) {
      setShippingMethods([
        ...shippingMethods,
        { ...newShippingMethod, id: Date.now() },
      ]);
      setNewShippingMethod({ name: "", cost: 0, enabled: true });
    }
  };

  const handleDeleteShippingMethod = (id) => {
    setShippingMethods(shippingMethods.filter((method) => method.id !== id));
  };

  const handleToggleShippingMethod = (id) => {
    setShippingMethods(
      shippingMethods.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaStore className="mr-3 text-gold-500" />
          Store Configuration
        </h1>
        <div className="flex space-x-3">
          {editing ? (
            <>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-md hover:bg-gold-600 transition-colors"
              >
                <FaSave className="mr-2" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-md hover:bg-gold-600 transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Store Name</label>
            <input
              type="text"
              name="name"
              value={storeSettings.name}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={storeSettings.email}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={storeSettings.phone}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              name="currency"
              value={storeSettings.currency}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            >
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={storeSettings.description}
              onChange={handleInputChange}
              disabled={!editing}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">
          Address Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={storeSettings.address}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              value={storeSettings.city}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={storeSettings.postal_code}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={storeSettings.country}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">
          Pricing Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              name="tax_rate"
              value={storeSettings.tax_rate}
              onChange={handleInputChange}
              disabled={!editing}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Default Shipping Cost
            </label>
            <input
              type="number"
              name="shipping_cost"
              value={storeSettings.shipping_cost}
              onChange={handleInputChange}
              disabled={!editing}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Free Shipping Threshold
            </label>
            <input
              type="number"
              name="free_shipping_threshold"
              value={storeSettings.free_shipping_threshold}
              onChange={handleInputChange}
              disabled={!editing}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">
          Payment Methods
        </h2>
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPaymentMethod.name}
              onChange={(e) =>
                setNewPaymentMethod({
                  ...newPaymentMethod,
                  name: e.target.value,
                })
              }
              disabled={!editing}
              placeholder="Payment method name"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
            <button
              onClick={handleAddPaymentMethod}
              disabled={!editing}
              className="px-4 py-2 bg-gold-500 text-black rounded-md hover:bg-gold-600 transition-colors disabled:opacity-50"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-md"
            >
              <span>{method.name}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePaymentMethod(method.id)}
                  disabled={!editing}
                  className={`px-3 py-1 rounded-md text-sm ${
                    method.enabled ? "bg-green-600" : "bg-gray-600"
                  } disabled:opacity-50`}
                >
                  {method.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  disabled={!editing}
                  className="p-1 text-red-500 hover:text-red-400 disabled:opacity-50"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">
          Shipping Methods
        </h2>
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newShippingMethod.name}
              onChange={(e) =>
                setNewShippingMethod({
                  ...newShippingMethod,
                  name: e.target.value,
                })
              }
              disabled={!editing}
              placeholder="Shipping method name"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
            <input
              type="number"
              value={newShippingMethod.cost}
              onChange={(e) =>
                setNewShippingMethod({
                  ...newShippingMethod,
                  cost: parseFloat(e.target.value) || 0,
                })
              }
              disabled={!editing}
              placeholder="Cost"
              min="0"
              step="0.01"
              className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
            <button
              onClick={handleAddShippingMethod}
              disabled={!editing}
              className="px-4 py-2 bg-gold-500 text-black rounded-md hover:bg-gold-600 transition-colors disabled:opacity-50"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-md"
            >
              <span>
                {method.name} ({method.cost})
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleShippingMethod(method.id)}
                  disabled={!editing}
                  className={`px-3 py-1 rounded-md text-sm ${
                    method.enabled ? "bg-green-600" : "bg-gray-600"
                  } disabled:opacity-50`}
                >
                  {method.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  onClick={() => handleDeleteShippingMethod(method.id)}
                  disabled={!editing}
                  className="p-1 text-red-500 hover:text-red-400 disabled:opacity-50"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gold-500">Policies</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Return Policy
            </label>
            <textarea
              name="return_policy"
              value={storeSettings.return_policy}
              onChange={handleInputChange}
              disabled={!editing}
              rows="5"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Privacy Policy
            </label>
            <textarea
              name="privacy_policy"
              value={storeSettings.privacy_policy}
              onChange={handleInputChange}
              disabled={!editing}
              rows="5"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Terms of Service
            </label>
            <textarea
              name="terms_of_service"
              value={storeSettings.terms_of_service}
              onChange={handleInputChange}
              disabled={!editing}
              rows="5"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreConfig;
