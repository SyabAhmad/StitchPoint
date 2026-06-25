import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaSave,
  FaTimes,
  FaEdit,
  FaPlus,
  FaTrash,
  FaBell,
  FaLock,
  FaServer,
  FaDatabase,
  FaGlobe,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: "StitchPoint",
    site_description: "Your one-stop shop for all stitching needs",
    maintenance_mode: false,
    maintenance_message: "We are currently undergoing maintenance. Please check back later.",
    timezone: "UTC+5:00",
    language: "en",
    date_format: "YYYY-MM-DD",
    time_format: "12h",
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_email: "",
    from_name: "StitchPoint",
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    password_min_length: 8,
    require_special_chars: true,
    require_numbers: true,
    max_login_attempts: 5,
    lockout_duration: 15, // minutes
    session_timeout: 120, // minutes
    two_factor_auth: false,
    allowed_login_attempts: 5,
  });

  // API settings
  const [apiSettings, setApiSettings] = useState({
    enabled: false,
    rate_limiting: 100, // requests per minute
    api_key_required: true,
    allowed_origins: ["*"],
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    admin_email_notifications: true,
    order_notifications: true,
    user_registration_notifications: true,
    low_stock_notifications: true,
    payment_notifications: true,
  });

  // Backup settings
  const [backupSettings, setBackupSettings] = useState({
    enabled: true,
    frequency: "daily",
    time: "02:00",
    retention: 7, // days
    auto_backup: true,
    cloud_backup: false,
    cloud_provider: "",
    cloud_credentials: {},
  });

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/system-settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch system settings");
        }

        const data = await response.json();
        setGeneralSettings(data.general_settings || generalSettings);
        setEmailSettings(data.email_settings || emailSettings);
        setSecuritySettings(data.security_settings || securitySettings);
        setApiSettings(data.api_settings || apiSettings);
        setNotificationSettings(data.notification_settings || notificationSettings);
        setBackupSettings(data.backup_settings || backupSettings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching system settings:", error);
        toast.error("Failed to load system settings");
        setLoading(false);
      }
    };

    fetchSystemSettings();
  }, []);

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseInt(value) || value,
    }));
  };

  const handleApiChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApiSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleBackupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBackupSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/system-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          general_settings: generalSettings,
          email_settings: emailSettings,
          security_settings: securitySettings,
          api_settings: apiSettings,
          notification_settings: notificationSettings,
          backup_settings: backupSettings,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save system settings");
      }

      toast.success("System settings saved successfully");
      setEditing(false);
      setSaving(false);
    } catch (error) {
      console.error("Error saving system settings:", error);
      toast.error("Failed to save system settings");
      setSaving(false);
    }
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
          <FaCog className="mr-3 text-gold-500" />
          System Settings
        </h1>
        <div className="flex space-x-3">
          {editing ? (
            <>
              <button
                onClick={handleSaveSettings}
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

      {/* General Settings */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-500">
          <FaGlobe className="mr-2" />
          General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              name="site_name"
              value={generalSettings.site_name}
              onChange={handleGeneralChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              name="timezone"
              value={generalSettings.timezone}
              onChange={handleGeneralChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            >
              <option value="UTC+5:00">UTC+5:00 (Pakistan)</option>
              <option value="UTC+0:00">UTC+0:00 (London)</option>
              <option value="UTC-5:00">UTC-5:00 (New York)</option>
              <option value="UTC+8:00">UTC+8:00 (Shanghai)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              name="language"
              value={generalSettings.language}
              onChange={handleGeneralChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="zh">Chinese</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Format</label>
            <select
              name="date_format"
              value={generalSettings.date_format}
              onChange={handleGeneralChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <textarea
              name="site_description"
              value={generalSettings.site_description}
              onChange={handleGeneralChange}
              disabled={!editing}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            ></textarea>
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="maintenance_mode"
              name="maintenance_mode"
              checked={generalSettings.maintenance_mode}
              onChange={handleGeneralChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="maintenance_mode" className="text-sm font-medium">
              Maintenance Mode
            </label>
          </div>
          {generalSettings.maintenance_mode && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Maintenance Message</label>
              <textarea
                name="maintenance_message"
                value={generalSettings.maintenance_message}
                onChange={handleGeneralChange}
                disabled={!editing}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
              ></textarea>
            </div>
          )}
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-500">
          <FaBell className="mr-2" />
          Email Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">SMTP Host</label>
            <input
              type="text"
              name="host"
              value={emailSettings.host}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SMTP Port</label>
            <input
              type="number"
              name="port"
              value={emailSettings.port}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={emailSettings.username}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={emailSettings.password}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Encryption</label>
            <select
              name="encryption"
              value={emailSettings.encryption}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            >
              <option value="none">None</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">From Email</label>
            <input
              type="email"
              name="from_email"
              value={emailSettings.from_email}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">From Name</label>
            <input
              type="text"
              name="from_name"
              value={emailSettings.from_name}
              onChange={handleEmailChange}
              disabled={!editing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-500">
          <FaShieldAlt className="mr-2" />
          Security Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Password Length</label>
            <input
              type="number"
              name="password_min_length"
              value={securitySettings.password_min_length}
              onChange={handleSecurityChange}
              disabled={!editing}
              min="4"
              max="20"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
            <input
              type="number"
              name="max_login_attempts"
              value={securitySettings.max_login_attempts}
              onChange={handleSecurityChange}
              disabled={!editing}
              min="1"
              max="10"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lockout Duration (minutes)</label>
            <input
              type="number"
              name="lockout_duration"
              value={securitySettings.lockout_duration}
              onChange={handleSecurityChange}
              disabled={!editing}
              min="1"
              max="60"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              name="session_timeout"
              value={securitySettings.session_timeout}
              onChange={handleSecurityChange}
              disabled={!editing}
              min="5"
              max="1440"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_special_chars"
              name="require_special_chars"
              checked={securitySettings.require_special_chars}
              onChange={handleSecurityChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="require_special_chars" className="text-sm font-medium">
              Require Special Characters in Password
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_numbers"
              name="require_numbers"
              checked={securitySettings.require_numbers}
              onChange={handleSecurityChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="require_numbers" className="text-sm font-medium">
              Require Numbers in Password
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="two_factor_auth"
              name="two_factor_auth"
              checked={securitySettings.two_factor_auth}
              onChange={handleSecurityChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="two_factor_auth" className="text-sm font-medium">
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-500">
          <FaServer className="mr-2" />
          API Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="api_enabled"
              name="enabled"
              checked={apiSettings.enabled}
              onChange={handleApiChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="api_enabled" className="text-sm font-medium">
              Enable API
            </label>
          </div>
          {apiSettings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Rate Limit (requests per minute)</label>
                <input
                  type="number"
                  name="rate_limiting"
                  value={apiSettings.rate_limiting}
                  onChange={handleApiChange}
                  disabled={!editing}
                  min="1"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="api_key_required"
                  name="api_key_required"
                  checked={apiSettings.api_key_required}
                  onChange={handleApiChange}
                  disabled={!editing}
                  className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
                />
                <label htmlFor="api_key_required" className="text-sm font-medium">
                  API Key Required
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Allowed Origins (comma separated)</label>
                <input
                  type="text"
                  name="allowed_origins"
                  value={apiSettings.allowed_origins.join(", ")}
                  onChange={(e) => handleApiChange({
                    target: {
                      name: "allowed_origins",
                      value: e.target.value.split(",").map(origin => origin.trim())
                    }
                  })}
                  disabled={!editing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-500">
          <FaBell className="mr-2" />
          Notification Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email_notifications"
              name="email_notifications"
              checked={notificationSettings.email_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="email_notifications" className="text-sm font-medium">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms_notifications"
              name="sms_notifications"
              checked={notificationSettings.sms_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="sms_notifications" className="text-sm font-medium">
              SMS Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push_notifications"
              name="push_notifications"
              checked={notificationSettings.push_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="push_notifications" className="text-sm font-medium">
              Push Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="admin_email_notifications"
              name="admin_email_notifications"
              checked={notificationSettings.admin_email_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="admin_email_notifications" className="text-sm font-medium">
              Admin Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="order_notifications"
              name="order_notifications"
              checked={notificationSettings.order_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="order_notifications" className="text-sm font-medium">
              Order Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="user_registration_notifications"
              name="user_registration_notifications"
              checked={notificationSettings.user_registration_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="user_registration_notifications" className="text-sm font-medium">
              User Registration Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="low_stock_notifications"
              name="low_stock_notifications"
              checked={notificationSettings.low_stock_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="low_stock_notifications" className="text-sm font-medium">
              Low Stock Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="payment_notifications"
              name="payment_notifications"
              checked={notificationSettings.payment_notifications}
              onChange={handleNotificationChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="payment_notifications" className="text-sm font-medium">
              Payment Notifications
            </label>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-500">
          <FaDatabase className="mr-2" />
          Backup Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="backup_enabled"
              name="enabled"
              checked={backupSettings.enabled}
              onChange={handleBackupChange}
              disabled={!editing}
              className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
            />
            <label htmlFor="backup_enabled" className="text-sm font-medium">
              Enable Backups
            </label>
          </div>
          {backupSettings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                <select
                  name="frequency"
                  value={backupSettings.frequency}
                  onChange={handleBackupChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Backup Time</label>
                <input
                  type="time"
                  name="time"
                  value={backupSettings.time}
                  onChange={handleBackupChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Retention Period (days)</label>
                <input
                  type="number"
                  name="retention"
                  value={backupSettings.retention}
                  onChange={handleBackupChange}
                  disabled={!editing}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_backup"
                  name="auto_backup"
                  checked={backupSettings.auto_backup}
                  onChange={handleBackupChange}
                  disabled={!editing}
                  className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
                />
                <label htmlFor="auto_backup" className="text-sm font-medium">
                  Auto Backup
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cloud_backup"
                  name="cloud_backup"
                  checked={backupSettings.cloud_backup}
                  onChange={handleBackupChange}
                  disabled={!editing}
                  className="mr-2 h-5 w-5 text-gold-500 focus:ring-gold-500 border-gray-600 rounded"
                />
                <label htmlFor="cloud_backup" className="text-sm font-medium">
                  Cloud Backup
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
