import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLOR_PALETTES } from '../../data/ConstantValues';

export default function SellerHeader({ user, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Logo/Brand with Store Name */}
        <Link to="/seller/dashboard" className="flex items-center gap-3">
          <div
            className="text-2xl font-bold"
            style={{ color: COLOR_PALETTES.gold }}
          >
            🏪
          </div>
          <div className="hidden sm:block">
            <div
              className="text-sm font-semibold"
              style={{ color: COLOR_PALETTES.gold }}
            >
              {user?.store_name || "My Store"}
            </div>
            <div className="text-xs" style={{ color: "#999" }}>
              Seller Dashboard
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/shop"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            All Products
          </Link>
          <Link
            to="/seller/dashboard"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Dashboard
          </Link>
          <Link
            to="/seller/products"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Products
          </Link>
          <Link
            to="/seller/orders"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Orders
          </Link>
          <Link
            to="/seller/analytics"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: COLOR_PALETTES.white }}
          >
            Analytics
          </Link>
        </nav>

        {/* Right Section - Stats & Profile */}
        <div className="flex items-center gap-6">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{ color: COLOR_PALETTES.gold }}
              >
                0
              </div>
              <div className="text-xs" style={{ color: "#999" }}>
                Active
              </div>
            </div>
            <div
              style={{
                backgroundColor: COLOR_PALETTES.gold,
                width: "1px",
                height: "30px",
              }}
            ></div>
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{ color: COLOR_PALETTES.gold }}
              >
                0
              </div>
              <div className="text-xs" style={{ color: "#999" }}>
                Orders
              </div>
            </div>
          </div>

          {/* Notifications */}
          <button
            className="text-2xl transition hover:scale-110 relative"
            title="Notifications"
          >
            🔔
            <span
              className="absolute top-0 right-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: COLOR_PALETTES.gold }}
            ></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition"
              style={{
                backgroundColor: showDropdown
                  ? COLOR_PALETTES.gold
                  : "transparent",
                border: `2px solid ${COLOR_PALETTES.gold}`,
              }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: COLOR_PALETTES.gold }}
              >
                {user?.first_name ? user.first_name[0].toUpperCase() : "S"}
              </div>

              {/* Name */}
              <span
                className="text-sm font-semibold hidden sm:inline"
                style={{
                  color: showDropdown
                    ? COLOR_PALETTES.black
                    : COLOR_PALETTES.gold,
                }}
              >
                {user?.first_name || "Seller"}
              </span>

              {/* Chevron */}
              <span
                style={{
                  color: showDropdown
                    ? COLOR_PALETTES.black
                    : COLOR_PALETTES.gold,
                }}
              >
                {showDropdown ? "▲" : "▼"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-lg shadow-2xl z-50"
                style={{ backgroundColor: COLOR_PALETTES.white }}
              >
                {/* User Section */}
                <div
                  className="px-4 py-4 border-b-2"
                  style={{ borderColor: COLOR_PALETTES.gold }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: COLOR_PALETTES.gold }}
                    >
                      {user?.first_name
                        ? user.first_name[0].toUpperCase()
                        : "S"}
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: COLOR_PALETTES.black }}
                      >
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs" style={{ color: "#999" }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-semibold text-center"
                    style={{
                      backgroundColor: COLOR_PALETTES.gold,
                      color: COLOR_PALETTES.black,
                    }}
                  >
                    Seller Account
                  </div>
                </div>

                {/* Account Section */}
                <div className="py-2">
                  <div
                    className="px-4 py-2 text-xs font-semibold"
                    style={{ color: COLOR_PALETTES.gold }}
                  >
                    ACCOUNT
                  </div>

                  <button
                    onClick={() => {
                      navigate("/seller/profile");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    👤 <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/seller/store");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    🏪 <span>Store Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/seller/billing");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    💳 <span>Billing & Payments</span>
                  </button>
                </div>

                {/* Preferences Section */}
                <div className="py-2">
                  <div
                    className="px-4 py-2 text-xs font-semibold"
                    style={{ color: COLOR_PALETTES.gold }}
                  >
                    PREFERENCES
                  </div>

                  <button
                    onClick={() => {
                      navigate("/seller/notifications");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    🔔 <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/seller/security");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    🔒 <span>Security</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/seller/integrations");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    🔗 <span>Integrations</span>
                  </button>
                </div>

                {/* Support Section */}
                <div className="py-2">
                  <div
                    className="px-4 py-2 text-xs font-semibold"
                    style={{ color: COLOR_PALETTES.gold }}
                  >
                    SUPPORT
                  </div>

                  <button
                    onClick={() => {
                      navigate("/seller/help");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    ❓ <span>Help Center</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/seller/support");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                    style={{ color: COLOR_PALETTES.black }}
                  >
                    💬 <span>Contact Support</span>
                  </button>
                </div>

                {/* Divider */}
                <div
                  className="my-2"
                  style={{
                    backgroundColor: COLOR_PALETTES.gold,
                    height: "1px",
                  }}
                ></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3"
                  style={{ color: "#c00" }}
                >
                  🚪 <span className="font-semibold">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
            style={{ color: COLOR_PALETTES.gold }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden mt-4 pb-4 border-t-2"
          style={{ borderColor: COLOR_PALETTES.gold }}
        >
          <Link
            to="/seller/dashboard"
            className="block px-4 py-2 text-sm font-semibold"
            style={{ color: COLOR_PALETTES.gold }}
          >
            Dashboard
          </Link>
          <Link
            to="/seller/products"
            className="block px-4 py-2 text-sm font-semibold"
            style={{ color: COLOR_PALETTES.gold }}
          >
            Products
          </Link>
          <Link
            to="/seller/orders"
            className="block px-4 py-2 text-sm font-semibold"
            style={{ color: COLOR_PALETTES.gold }}
          >
            Orders
          </Link>
          <Link
            to="/seller/analytics"
            className="block px-4 py-2 text-sm font-semibold"
            style={{ color: COLOR_PALETTES.gold }}
          >
            Analytics
          </Link>
        </div>
      )}
    </header>
  );
}
