import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
} from "react-icons/fa";

const NaqshCoutureNavbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar !bg-(--black-naqsh)">
      <div className="container mx-auto container-inline">
        <div className="nc-logo">
          <h1
            className="text-2xl font-serif"
            style={{ color: "var(--gold-500)" }}
          >
            Naqsh Couture
          </h1>
        </div>
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-white hover:text-gold-500 transition-colors duration-300"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FaBars size={24} />
        </button>

        {/* Desktop Nav Items */}
        <ul className="hidden md:flex nav-items font-sans">
          <li>
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "nav-link-active" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`nav-link ${
                location.pathname === "/about" ? "nav-link-active" : ""
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className={`nav-link ${
                location.pathname === "/shop" ? "nav-link-active" : ""
              }`}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`nav-link ${
                location.pathname === "/contact" ? "nav-link-active" : ""
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="md:hidden absolute top-full left-0 w-full bg-black-naqsh text-white flex flex-col items-center space-y-4 py-4 font-sans">
            <li>
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "nav-link-active" : ""
                }`}
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`nav-link ${
                  location.pathname === "/about" ? "nav-link-active" : ""
                }`}
                onClick={toggleMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={`nav-link ${
                  location.pathname === "/shop" ? "nav-link-active" : ""
                }`}
                onClick={toggleMenu}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`nav-link ${
                  location.pathname === "/contact" ? "nav-link-active" : ""
                }`}
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        )}
        <div className="flex items-center" style={{ gap: "2.95rem" }}>
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Dashboard Link */}
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard"
                    : user.role === "manager"
                    ? "/manager-dashboard"
                    : "/super-admin-dashboard"
                }
                className={`flex items-center space-x-2 transition-colors duration-300 ${
                  (user.role === "customer" &&
                    location.pathname === "/customer-dashboard") ||
                  (user.role === "manager" &&
                    location.pathname.startsWith("/manager-dashboard")) ||
                  (user.role === "super_admin" &&
                    location.pathname.startsWith("/super-admin-dashboard"))
                    ? "text-gold-500"
                    : "text-white hover:text-gold-500"
                }`}
                title="Go to Dashboard"
              >
                <FaTachometerAlt />
                <span className="hidden md:block">Dashboard</span>
              </Link>

              {/* Cart Icon */}
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard/cart"
                    : "/cart"
                }
                className={`btn-icon ${
                  (user.role === "customer" &&
                    location.pathname === "/customer-dashboard/cart") ||
                  (user.role !== "customer" && location.pathname === "/cart")
                    ? "active"
                    : ""
                }`}
                title="View Cart"
              >
                <FaShoppingCart />
              </Link>
              {/* Wishlist Icon */}
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard/wishlist"
                    : "/wishlist"
                }
                className={`btn-icon ${
                  (user.role === "customer" &&
                    location.pathname === "/customer-dashboard/wishlist") ||
                  (user.role !== "customer" &&
                    location.pathname === "/wishlist")
                    ? "active"
                    : ""
                }`}
                title="View Wishlist"
              >
                <FaHeart />
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-icon"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-gold">
                Login
              </Link>
              <Link to="/signup" className="btn-gold">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NaqshCoutureNavbar;
