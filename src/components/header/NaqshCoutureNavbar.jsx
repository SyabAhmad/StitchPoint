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
          <Link to="/cart" className="btn-icon">
            <FaShoppingCart />
          </Link>
          <Link to="/wishlist" className="btn-icon">
            <FaHeart />
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === "customer" && (
                <Link to="/dashboard" className="btn-icon">
                  <FaUser />
                </Link>
              )}
              {user.role === "manager" && (
                <Link to="/manager-dashboard" className="btn-icon">
                  <FaUser />
                </Link>
              )}
              {user.role === "super_admin" && (
                <Link to="/super-admin-dashboard" className="btn-icon">
                  <FaUser />
                </Link>
              )}
              <button onClick={handleLogout} className="btn-icon">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-gold">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NaqshCoutureNavbar;
