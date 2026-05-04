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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

    return (
<nav className="sticky top-0 z-50 bg-black border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-widest text-white group-hover:text-gray-300 transition-colors duration-300" style={{ fontFamily: '"Playfair Display", serif' }}>
                  NAQSH
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[2px] bg-white transition-all duration-300"></div>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-light tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors duration-300" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                STUDIO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {[
              { path: "/", label: "HOME" },
              { path: "/about", label: "ABOUT" },
              { path: "/shop", label: "SHOP" },
              { path: "/contact", label: "CONTACT" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                  location.pathname === path
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons/Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link
                  to={
                    user.role === "customer"
                      ? "/customer-dashboard"
                      : user.role === "manager"
                      ? "/manager-dashboard"
                      : "/super-admin-dashboard"
                  }
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                  title="Dashboard"
                >
                  <FaTachometerAlt size={18} />
                </Link>

                <Link
                  to={
                    user.role === "customer"
                      ? "/customer-dashboard/cart"
                      : "/cart"
                  }
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                  title="Cart"
                >
                  <FaShoppingCart size={18} />
                </Link>

                <Link
                  to={
                    user.role === "customer"
                      ? "/customer-dashboard/wishlist"
                      : "/wishlist"
                  }
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                  title="Wishlist"
                >
                  <FaHeart size={18} />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                  title="Logout"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium tracking-wider text-gray-400 hover:text-white transition-colors duration-300"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-bold tracking-wider text-black bg-white hover:bg-gray-200 transition-all duration-300"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
  <div
  className={`md:hidden transition-all duration-300 ease-in-out ${
    isMenuOpen
    ? "max-h-[20rem] opacity-100"
    : "max-h-0 opacity-0"
  } overflow-hidden bg-black border-t border-white/20`}
  >
        <div className="px-4 py-3 space-y-2">
          {[
            { path: "/", label: "HOME" },
            { path: "/about", label: "ABOUT" },
            { path: "/shop", label: "SHOP" },
            { path: "/contact", label: "CONTACT" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={closeMenu}
              className={`block px-4 py-3 text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                location.pathname === path
                  ? "text-white border-l-2 border-white pl-3"
                  : "text-gray-400 hover:text-white hover:pl-3 hover:border-l-2 hover:border-white/50"
              }`}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <div className="pt-3 mt-3 border-t border-white/20 space-y-2">
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard"
                    : user.role === "manager"
                    ? "/manager-dashboard"
                    : "/super-admin-dashboard"
                }
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaTachometerAlt size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard/cart"
                    : "/cart"
                }
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaShoppingCart size={18} />
                <span>Cart</span>
              </Link>
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard/wishlist"
                    : "/wishlist"
                }
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaHeart size={18} />
                <span>Wishlist</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 transition-colors duration-300 w-full text-left"
              >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 mt-3 border-t border-white/20 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="px-4 py-3 text-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-300 font-medium"
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="px-4 py-3 text-center text-black bg-white hover:bg-gray-200 transition-colors duration-300 font-bold"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NaqshCoutureNavbar;
