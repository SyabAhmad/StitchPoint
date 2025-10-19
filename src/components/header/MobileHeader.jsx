import { useState } from "react";
import { Link } from "react-router-dom";
import COLOR_PALETTES from "../../../theme";
import { getData } from "../../data/ConstantValues";

const MobileHeader = ({ isLoggedIn = false }) => {
  const palette = COLOR_PALETTES.luxuryCouture;
  const navItems = isLoggedIn
    ? getData("navbars.afterSignin")
    : getData("navbars.beforeSignin");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="lg:hidden sticky top-0 z-50 w-full shadow-2xl"
      style={{ backgroundColor: palette.primaryHeader }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: palette.accentButton }}
          >
            S
          </div>
          <span className="text-lg font-bold text-white">StitchPoint</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="flex flex-col gap-1.5 bg-none border-none cursor-pointer p-2 transition-transform duration-300"
          onClick={toggleMobileMenu}
          style={{ color: palette.background }}
          aria-label="Toggle mobile menu"
        >
          <span
            className="w-6 h-0.5 rounded-full bg-current block transition-all duration-300"
            style={{
              transform: isMobileMenuOpen
                ? "rotate(45deg) translate(6px, 6px)"
                : "rotate(0deg)",
            }}
          ></span>
          <span
            className="w-6 h-0.5 rounded-full bg-current block transition-all duration-300"
            style={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
          ></span>
          <span
            className="w-6 h-0.5 rounded-full bg-current block transition-all duration-300"
            style={{
              transform: isMobileMenuOpen
                ? "rotate(-45deg) translate(6px, -6px)"
                : "rotate(0deg)",
            }}
          ></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav
          className="border-t transition-all duration-300 max-h-96 overflow-y-auto"
          style={{
            backgroundColor: palette.background,
            borderTopColor: palette.accentButton,
          }}
        >
          <ul className="list-none p-0 m-0">
            {navItems.map((item, index) => (
              <li key={index} className="border-b border-gray-200/30">
                <Link
                  to={item.href}
                  className="block px-6 py-4 text-sm font-semibold transition-all duration-200 relative overflow-hidden group"
                  style={{
                    color: item.primary
                      ? palette.background
                      : item.danger
                      ? "#FF6B6B"
                      : palette.text,
                    backgroundColor: item.primary
                      ? palette.accentButton
                      : "transparent",
                  }}
                  onClick={handleNavClick}
                >
                  <span className="relative z-10">{item.text}</span>
                  {!item.primary && (
                    <span
                      className="absolute inset-y-0 left-0 w-0 transition-all duration-300 group-active:w-1"
                      style={{ backgroundColor: palette.accentButton }}
                    ></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;
