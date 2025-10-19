import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import COLOR_PALETTES from '../../theme.js';
export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar_url: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar_url: userData.avatar_url || '',
    });
    setAvatarPreview(userData.avatar_url || null);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div style={{ color: COLOR_PALETTES.gold }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: COLOR_PALETTES.black }}>
            My Profile
          </h1>
          <p style={{ color: '#666' }} className="mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Main Profile Card */}
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{
            backgroundColor: COLOR_PALETTES.white,
            border: `1px solid #e0e0e0`,
          }}
        >
          {/* Profile Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-8 border-b border-gray-200">
            {/* Avatar Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-full mb-4 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: COLOR_PALETTES.gold + '20',
                  border: `3px solid ${COLOR_PALETTES.gold}`,
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ color: COLOR_PALETTES.gold }} className="text-4xl">
                    👤
                  </span>
                )}
              </div>

              {isEditing ? (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div
                    className="px-4 py-2 rounded-lg font-semibold transition hover:shadow-md"
                    style={{
                      backgroundColor: COLOR_PALETTES.gold,
                      color: COLOR_PALETTES.white,
                    }}
                  >
                    Change Photo
                  </div>
                </label>
              ) : (
                <p style={{ color: '#999' }} className="text-sm">
                  {user.role === 'seller' ? 'Store Owner' : 'Customer'}
                </p>
              )}
            </div>

            {/* Profile Info Section */}
            <div className="md:col-span-2">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-xl font-semibold" style={{ color: COLOR_PALETTES.black }}>
                      {formData.first_name} {formData.last_name}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-lg" style={{ color: '#333' }}>
                      {formData.email}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-lg" style={{ color: '#333' }}>
                      {formData.phone || 'Not provided'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 px-6 py-2 rounded-lg font-semibold transition hover:shadow-md"
                    style={{
                      backgroundColor: COLOR_PALETTES.gold,
                      color: COLOR_PALETTES.white,
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                      disabled
                    />
                  </div>

                  <div>
                    <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-6 py-2 rounded-lg font-semibold transition hover:shadow-md"
                      style={{
                        backgroundColor: COLOR_PALETTES.gold,
                        color: COLOR_PALETTES.white,
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarPreview(user.avatar_url || null);
                        setFormData({
                          first_name: user.first_name || '',
                          last_name: user.last_name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          avatar_url: user.avatar_url || '',
                        });
                      }}
                      className="flex-1 px-6 py-2 rounded-lg font-semibold transition border-2"
                      style={{
                        borderColor: COLOR_PALETTES.gold,
                        color: COLOR_PALETTES.gold,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: COLOR_PALETTES.black }}>
              Account Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Type */}
              <div
                className="p-6 rounded-lg border"
                style={{ backgroundColor: '#f9f9f9', borderColor: '#e0e0e0' }}
              >
                <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
                  Account Type
                </p>
                <p
                  className="text-lg font-semibold capitalize"
                  style={{ color: COLOR_PALETTES.gold }}
                >
                  {user.role === 'seller' ? 'Seller Account' : 'Customer Account'}
                </p>
              </div>

              {/* Member Since */}
              <div
                className="p-6 rounded-lg border"
                style={{ backgroundColor: '#f9f9f9', borderColor: '#e0e0e0' }}
              >
                <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
                  Member Since
                </p>
                <p className="text-lg font-semibold" style={{ color: COLOR_PALETTES.black }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div
            className="mt-8 p-6 rounded-lg border"
            style={{
              backgroundColor: user.is_verified ? '#d4edda' : '#fff3cd',
              borderColor: user.is_verified ? '#c3e6cb' : '#ffc107',
            }}
          >
            <p
              style={{
                color: user.is_verified ? '#155724' : '#856404',
              }}
              className="font-semibold"
            >
              {user.is_verified ? '✓ Email Verified' : '⚠ Email Not Verified'}
            </p>
            <p
              style={{
                color: user.is_verified ? '#155724' : '#856404',
              }}
              className="text-sm mt-1"
            >
              {user.is_verified
                ? 'Your email has been verified. You can use all features.'
                : 'Please verify your email to unlock all features.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
