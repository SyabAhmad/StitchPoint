import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const NaqshCoutureNavbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/shop", label: "Shop" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const dashboardPath = user
    ? user.role === "customer"
      ? "/customer-dashboard"
      : user.role === "manager"
      ? "/manager-dashboard"
      : "/super-admin-dashboard"
    : null;

  const cartPath = user?.role === "customer" ? "/customer-dashboard/cart" : "/cart";
  const wishlistPath = user?.role === "customer" ? "/customer-dashboard/wishlist" : "/wishlist";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.5 shrink-0">
          <span className="text-gold-500 font-serif text-lg font-semibold tracking-wide">
            Naqsh
          </span>
          <span className="text-white font-serif text-lg font-light">
            Couture
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-[13px] font-medium tracking-wide transition-colors duration-200"
                style={{ color: isActive(link.to) ? "#D4AF37" : "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => { if (!isActive(link.to)) e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { if (!isActive(link.to)) e.target.style.color = "rgba(255,255,255,0.7)"; }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className={`hidden md:flex items-center gap-1.5 text-xs transition-colors ${
                  location.pathname.startsWith(dashboardPath)
                    ? "text-gold-500"
                    : "text-white/50 hover:text-white"
                }`}
                title="Dashboard"
              >
                <FaTachometerAlt className="text-[11px]" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>

              <Link
                to={cartPath}
                className={`relative transition-colors ${
                  location.pathname === cartPath
                    ? "text-gold-500"
                    : "text-white/50 hover:text-white"
                }`}
                title="Cart"
              >
                <FaShoppingCart className="text-sm" />
              </Link>

              <Link
                to={wishlistPath}
                className={`relative transition-colors ${
                  location.pathname === wishlistPath
                    ? "text-gold-500"
                    : "text-white/50 hover:text-white"
                }`}
                title="Wishlist"
              >
                <FaHeart className="text-sm" />
              </Link>

              <button
                onClick={handleLogout}
                className="text-white/50 hover:text-white transition-colors"
                title="Logout"
              >
                <FaSignOutAlt className="text-sm" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-[13px] text-white/60 hover:text-white font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-[13px] bg-gold-500 text-black px-4 py-1.5 rounded font-semibold hover:bg-gold-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes className="text-base" /> : <FaBars className="text-base" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <ul className="max-w-7xl mx-auto px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-gold-500"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link
                  to={dashboardPath}
                  className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NaqshCoutureNavbar;
