import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt } from "react-icons/fa";

const NaqshCoutureNavbar = () => {
  const [user, setUser] = useState(null);

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
        <ul className="nav-items font-sans">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/collections" className="nav-link">
              Collections
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex items-center" style={{ gap: "2.95rem" }}>
          {user ? (
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <Link
                to={
                  user.role === "customer"
                    ? "/dashboard"
                    : user.role === "manager"
                    ? "/manager-dashboard"
                    : "/super-admin-dashboard"
                }
                className="flex items-center space-x-2 text-white hover:text-gold-500 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold text-sm">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden md:block">{user.username}</span>
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="btn-icon">
                <FaShoppingCart />
              </Link>
              {/* Wishlist Icon */}
              <Link to="/wishlist" className="btn-icon">
                <FaHeart />
              </Link>
              {/* Logout Button */}
              <button onClick={handleLogout} className="btn-icon">
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
