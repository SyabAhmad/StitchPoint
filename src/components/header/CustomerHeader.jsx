import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLOR_PALETTES } from '../../data/ConstantValues';

export default function CustomerHeader({ user, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <header
      className="w-full py-4 px-6 border-b-2"
      style={{
        backgroundColor: COLOR_PALETTES.black,
        borderColor: COLOR_PALETTES.gold,
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="text-2xl font-bold"
            style={{ color: COLOR_PALETTES.gold }}
          >
            ✨ Naqosh
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Shop
          </Link>
          <a
            href="#"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Wishlist
          </a>
        </nav>

        {/* User Profile Section */}
        <div className="flex items-center gap-6">
          {/* Cart Icon */}
          <button
            className="text-2xl transition hover:scale-110"
            title="Shopping Cart"
          >
            🛒
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition"
              style={{
                backgroundColor: showDropdown ? COLOR_PALETTES.gold : 'transparent',
                border: `2px solid ${COLOR_PALETTES.gold}`,
              }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: COLOR_PALETTES.gold }}
              >
                {user?.first_name ? user.first_name[0].toUpperCase() : 'C'}
              </div>

              {/* Name */}
              <span
                className="text-sm font-semibold hidden sm:inline"
                style={{
                  color: showDropdown ? COLOR_PALETTES.black : COLOR_PALETTES.gold,
                }}
              >
                {user?.first_name || 'Customer'}
              </span>

              {/* Chevron */}
              <span
                style={{
                  color: showDropdown ? COLOR_PALETTES.black : COLOR_PALETTES.gold,
                }}
              >
                {showDropdown ? '▲' : '▼'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50"
                style={{ backgroundColor: COLOR_PALETTES.white }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 border-b-2"
                  style={{ borderColor: COLOR_PALETTES.gold }}
                >
                  <p className="font-semibold" style={{ color: COLOR_PALETTES.black }}>
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: '#999' }}
                  >
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    👤 <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/orders');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    📦 <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/wishlist');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    ❤️ <span>Wishlist</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/account');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    ⚙️ <span>Account Settings</span>
                  </button>

                  <div
                    className="my-2"
                    style={{ backgroundColor: COLOR_PALETTES.gold, height: '1px' }}
                  ></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: '#c00' }}
                  >
                    🚪 <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
