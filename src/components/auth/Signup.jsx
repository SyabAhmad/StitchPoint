import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLOR_PALETTES } from '../../data/ConstantValues';

export default function Signup({ onSwitchToLogin, onSignupSuccess }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // 'customer' or 'seller'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    storeName: '', // For sellers
    storeDescription: '', // For sellers
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (role === 'seller') {
      if (!formData.storeName) {
        setError('Store name is required for sellers');
        return false;
      }
      if (formData.storeName.length < 3) {
        setError('Store name must be at least 3 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: role,
          first_name: formData.firstName,
          last_name: formData.lastName,
          store_name: role === 'seller' ? formData.storeName : null,
          store_description: role === 'seller' ? formData.storeDescription : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call success callback
      if (onSignupSuccess) {
        onSignupSuccess(data.user);
      }

      // Show success message and redirect
      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-lg p-8 shadow-2xl"
      style={{
        backgroundColor: COLOR_PALETTES.white,
        border: `2px solid ${COLOR_PALETTES.gold}`,
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: COLOR_PALETTES.black }}
        >
          Join Naqosh

        </h1>
        <p style={{ color: '#666' }} className="text-sm">
          Create your account and start shopping or selling
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-6 space-y-3">
        <p className="text-sm font-semibold" style={{ color: COLOR_PALETTES.black }}>
          I want to:
        </p>
        <div className="flex gap-3">
          {/* Customer Option */}
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setError('');
            }}
            className="flex-1 p-3 rounded-lg border-2 transition"
            style={{
              borderColor: role === 'customer' ? COLOR_PALETTES.gold : '#ddd',
              backgroundColor: role === 'customer' ? `${COLOR_PALETTES.gold}15` : '#f9f9f9',
              color: COLOR_PALETTES.black,
            }}
          >
            <div className="text-xl mb-1">🛍️</div>
            <div className="font-semibold text-xs">Shop & Explore</div>
            <div className="text-xs" style={{ color: '#666' }}>
              Browse luxury items
            </div>
          </button>

          {/* Seller Option */}
          <button
            type="button"
            onClick={() => {
              setRole('seller');
              setError('');
            }}
            className="flex-1 p-3 rounded-lg border-2 transition"
            style={{
              borderColor: role === 'seller' ? COLOR_PALETTES.gold : '#ddd',
              backgroundColor: role === 'seller' ? `${COLOR_PALETTES.gold}15` : '#f9f9f9',
              color: COLOR_PALETTES.black,
            }}
          >
            <div className="text-xl mb-1">🏪</div>
            <div className="font-semibold text-xs">Create Store</div>
            <div className="text-xs" style={{ color: '#666' }}>
              Sell your products
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-3 rounded-lg text-sm"
          style={{
            backgroundColor: '#ffe6e6',
            color: '#c00',
            border: '1px solid #f5a5a5',
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
            style={{
              borderColor: COLOR_PALETTES.gold,
              backgroundColor: '#f9f9f9',
            }}
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
            style={{
              borderColor: COLOR_PALETTES.gold,
              backgroundColor: '#f9f9f9',
            }}
            disabled={loading}
          />
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
              style={{
                borderColor: COLOR_PALETTES.gold,
                backgroundColor: '#f9f9f9',
              }}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
              style={{
                borderColor: COLOR_PALETTES.gold,
                backgroundColor: '#f9f9f9',
              }}
              disabled={loading}
            />
          </div>
        </div>

        {/* Seller Fields */}
        {role === 'seller' && (
          <>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
                Store Name *
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Your store name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
                style={{
                  borderColor: COLOR_PALETTES.gold,
                  backgroundColor: '#f9f9f9',
                }}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
                Store Description
              </label>
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                placeholder="Tell us about your store..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm resize-none"
                rows="2"
                style={{
                  borderColor: COLOR_PALETTES.gold,
                  backgroundColor: '#f9f9f9',
                }}
                disabled={loading}
              />
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm pr-10"
              style={{
                borderColor: COLOR_PALETTES.gold,
                backgroundColor: '#f9f9f9',
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-xs"
              style={{ color: COLOR_PALETTES.gold }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: COLOR_PALETTES.black }}>
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm pr-10"
              style={{
                borderColor: COLOR_PALETTES.gold,
                backgroundColor: '#f9f9f9',
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-xs"
              style={{ color: COLOR_PALETTES.gold }}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            id="terms"
            className="mt-1"
            style={{ accentColor: COLOR_PALETTES.gold }}
          />
          <label htmlFor="terms" className="text-xs" style={{ color: '#666' }}>
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-bold text-lg transition duration-300 mt-6"
          style={{
            backgroundColor: loading ? '#ccc' : COLOR_PALETTES.gold,
            color: COLOR_PALETTES.black,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div
          className="flex-1"
          style={{ backgroundColor: COLOR_PALETTES.gold, height: '1px' }}
        ></div>
        <span className="px-3" style={{ color: '#999' }}>
          OR
        </span>
        <div
          className="flex-1"
          style={{ backgroundColor: COLOR_PALETTES.gold, height: '1px' }}
        ></div>
      </div>

      {/* Login Link */}
      <p className="text-center" style={{ color: '#666' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold transition hover:underline"
          style={{ color: COLOR_PALETTES.gold }}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
