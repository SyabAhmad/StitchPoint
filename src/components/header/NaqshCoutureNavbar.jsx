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
<nav className="sticky top-0 z-50 bg-gray-950 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-wide text-white group-hover:text-gray-300 transition-colors duration-300">
                  Naqsh
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[2px] bg-white transition-all duration-300"></div>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-light tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors duration-300">
                Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/shop", label: "Shop" },
              { path: "/contact", label: "Contact" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 rounded-md ${
                  location.pathname === path
                    ? "text-white bg-gray-800"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {label}
                {location.pathname === path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Icons/Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
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
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    (user.role === "customer" &&
                      location.pathname === "/customer-dashboard") ||
                    (user.role === "manager" &&
                      location.pathname.startsWith("/manager-dashboard")) ||
                    (user.role === "super_admin" &&
                      location.pathname.startsWith("/super-admin-dashboard"))
                      ? "text-white bg-gray-800"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
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
                  className={`p-2 rounded-lg transition-all duration-300 relative ${
                    (user.role === "customer" &&
                      location.pathname === "/customer-dashboard/cart") ||
                    (user.role !== "customer" && location.pathname === "/cart")
                      ? "text-white bg-gray-800"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
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
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    (user.role === "customer" &&
                      location.pathname ===
                        "/customer-dashboard/wishlist") ||
                    (user.role !== "customer" &&
                      location.pathname === "/wishlist")
                      ? "text-white bg-gray-800"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  title="Wishlist"
                >
                  <FaHeart size={18} />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                  title="Logout"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-[1px]"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
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
  } overflow-hidden bg-gray-950 border-t border-gray-800 backdrop-blur-sm`}
  >
        <div className="px-4 py-3 space-y-1">
          {[
            { path: "/", label: "Home" },
            { path: "/about", label: "About" },
            { path: "/shop", label: "Shop" },
            { path: "/contact", label: "Contact" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                location.pathname === path
                  ? "text-white bg-gray-800"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <div className="pt-3 mt-3 border-t border-gray-800 space-y-1">
              <Link
                to={
                  user.role === "customer"
                    ? "/customer-dashboard"
                    : user.role === "manager"
                    ? "/manager-dashboard"
                    : "/super-admin-dashboard"
                }
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
              >
                <FaHeart size={18} />
                <span>Wishlist</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 w-full text-left"
              >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 mt-3 border-t border-gray-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-center text-gray-900 bg-white hover:bg-gray-200 transition-all duration-300 font-medium"
              >
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
