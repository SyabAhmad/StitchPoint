import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLOR_PALETTES } from '../../data/ConstantValues';

export default function Login({ onSwitchToSignup, onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.username || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // API call to login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store tokens in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      // Redirect based on user role
      if (data.user.role === 'seller' || data.user.role === 'admin') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
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
          Welcome Back
        </h1>
        <p style={{ color: '#666' }} className="text-sm">
          Sign in to your Naqosh Couture account
        </p>
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-semibold mb-2"
            style={{ color: COLOR_PALETTES.black }}
          >
            Username or Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username or email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none transition"
            style={{
              borderColor: COLOR_PALETTES.gold,
              backgroundColor: '#f9f9f9',
            }}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-2"
            style={{ color: COLOR_PALETTES.black }}
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none transition pr-10"
              style={{
                borderColor: COLOR_PALETTES.gold,
                backgroundColor: '#f9f9f9',
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm"
              style={{ color: COLOR_PALETTES.gold }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
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
          {loading ? 'Signing In...' : 'Sign In'}
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

      {/* Sign Up Link */}
      <p className="text-center" style={{ color: '#666' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-bold transition hover:underline"
          style={{ color: COLOR_PALETTES.gold }}
        >
          Create one
        </button>
      </p>

      {/* Additional Links */}
      <div className="mt-6 flex justify-center gap-4 text-xs">
        <a href="#" style={{ color: COLOR_PALETTES.gold }} className="hover:underline">
          Forgot Password?
        </a>
        <span style={{ color: '#ddd' }}>•</span>
        <a href="#" style={{ color: COLOR_PALETTES.gold }} className="hover:underline">
          Contact Support
        </a>
      </div>
    </div>
  );
}
