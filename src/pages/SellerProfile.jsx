import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import COLOR_PALETTES from '../../theme.js';
export default function SellerProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [formData, setFormData] = useState({
    store_name: '',
    store_description: '',
    store_logo: '',
    store_banner: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const userData = JSON.parse(storedUser);
    
    // Only sellers can access this page
    if (userData.role !== 'seller' && userData.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(userData);
    setFormData({
      store_name: userData.store_name || '',
      store_description: userData.store_description || '',
      store_logo: userData.store_logo || '',
      store_banner: userData.store_banner || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      phone: userData.phone || '',
    });
    setLogoPreview(userData.store_logo || null);
    setBannerPreview(userData.store_banner || null);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ ...prev, store_logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
        setFormData(prev => ({ ...prev, store_banner: reader.result }));
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
      const response = await fetch('http://localhost:5000/api/seller/profile', {
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
        setMessage({ type: 'success', text: 'Store profile updated successfully!' });
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: COLOR_PALETTES.black }}>
            Store Profile
          </h1>
          <p style={{ color: '#666' }} className="mt-2">
            Manage your store information and branding
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

        {/* Main Store Profile Card */}
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: COLOR_PALETTES.white,
            border: `1px solid #e0e0e0`,
          }}
        >
          {/* Store Banner Preview/Edit */}
          <div
            className="h-48 w-full overflow-hidden relative"
            style={{
              backgroundColor: COLOR_PALETTES.gold + '15',
            }}
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Store Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span style={{ color: COLOR_PALETTES.gold, opacity: 0.3 }} className="text-6xl">
                  🏪
                </span>
              </div>
            )}

            {isEditing && (
              <label className="absolute bottom-4 right-4 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
                <div
                  className="px-4 py-2 rounded-lg font-semibold transition hover:shadow-md"
                  style={{
                    backgroundColor: COLOR_PALETTES.gold,
                    color: COLOR_PALETTES.white,
                  }}
                >
                  Change Banner
                </div>
              </label>
            )}
          </div>

          {/* Store Header Section */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-gray-200">
              {/* Store Logo */}
              <div className="md:col-span-1 flex flex-col items-center -mt-20">
                <div
                  className="w-32 h-32 rounded-full mb-4 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: COLOR_PALETTES.white,
                    border: `4px solid ${COLOR_PALETTES.gold}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Store Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span style={{ color: COLOR_PALETTES.gold }} className="text-4xl">
                      🏷️
                    </span>
                  )}
                </div>

                {isEditing && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div
                      className="px-4 py-2 rounded-lg font-semibold transition hover:shadow-md text-center"
                      style={{
                        backgroundColor: COLOR_PALETTES.gold,
                        color: COLOR_PALETTES.white,
                      }}
                    >
                      Change Logo
                    </div>
                  </label>
                )}
              </div>

              {/* Store Info Section */}
              <div className="md:col-span-3">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide">
                        Store Name
                      </p>
                      <p className="text-3xl font-bold" style={{ color: COLOR_PALETTES.gold }}>
                        {formData.store_name}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide">
                        Description
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {formData.store_description || 'No description provided'}
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
                      Edit Store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        name="store_name"
                        value={formData.store_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-lg"
                        style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                      />
                    </div>

                    <div>
                      <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                        Store Description
                      </label>
                      <textarea
                        name="store_description"
                        value={formData.store_description}
                        onChange={handleInputChange}
                        placeholder="Describe your store..."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            {!isEditing ? (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: COLOR_PALETTES.black }}>
                  Owner Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className="p-6 rounded-lg border"
                    style={{ backgroundColor: '#f9f9f9', borderColor: '#e0e0e0' }}
                  >
                    <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
                      Name
                    </p>
                    <p className="text-lg font-semibold" style={{ color: COLOR_PALETTES.black }}>
                      {formData.first_name} {formData.last_name}
                    </p>
                  </div>

                  <div
                    className="p-6 rounded-lg border"
                    style={{ backgroundColor: '#f9f9f9', borderColor: '#e0e0e0' }}
                  >
                    <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
                      Phone
                    </p>
                    <p className="text-lg" style={{ color: '#333' }}>
                      {formData.phone || 'Not provided'}
                    </p>
                  </div>

                  <div
                    className="p-6 rounded-lg border"
                    style={{ backgroundColor: '#f9f9f9', borderColor: '#e0e0e0' }}
                  >
                    <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
                      Verification Status
                    </p>
                    <p
                      className="text-lg font-semibold"
                      style={{ color: user.is_verified ? COLOR_PALETTES.gold : '#e74c3c' }}
                    >
                      {user.is_verified ? '✓ Verified' : '✗ Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: COLOR_PALETTES.black }}>
                  Owner Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                </div>

                <div className="flex gap-3">
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
                      setLogoPreview(user.store_logo || null);
                      setBannerPreview(user.store_banner || null);
                      setFormData({
                        store_name: user.store_name || '',
                        store_description: user.store_description || '',
                        store_logo: user.store_logo || '',
                        store_banner: user.store_banner || '',
                        first_name: user.first_name || '',
                        last_name: user.last_name || '',
                        phone: user.phone || '',
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

        {/* Store Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
              Total Products
            </p>
            <p className="text-4xl font-bold" style={{ color: COLOR_PALETTES.gold }}>
              0
            </p>
          </div>

          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
              Total Sales
            </p>
            <p className="text-4xl font-bold" style={{ color: COLOR_PALETTES.gold }}>
              $0
            </p>
          </div>

          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <p style={{ color: '#999' }} className="text-sm uppercase tracking-wide mb-2">
              Store Rating
            </p>
            <p className="text-4xl font-bold" style={{ color: COLOR_PALETTES.gold }}>
              4.9
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
