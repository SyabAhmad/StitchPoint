import { useState } from "react";
import { Link } from "react-router-dom";
import COLOR_PALETTES from "../../../theme";
import { getData } from "../../data/ConstantValues";

const MainHeader = ({ isLoggedIn = false, onMobileMenuToggle }) => {
  const palette = COLOR_PALETTES.luxuryCouture || {
    primaryHeader: "#151515",
    background: "#FFFFFF",
    accentButton: "#D4AF37",
    text: "#151515",
    hoverHighlight: "#F5F5F5",
  };

  const navItems = isLoggedIn
    ? getData("navbars.afterSignin")
    : getData("navbars.beforeSignin");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for dynamic header effect
  useState(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMobileMenuToggle?.(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-2xl" : "shadow-lg"
      }`}
      style={{
        backgroundColor: palette.primaryHeader,
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
    >
      <div className="px-6 lg:px-12 py-3 lg:py-5 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{ backgroundColor: palette.accentButton }}
          >
            NC
          </div>
          <span className="text-xl lg:text-2xl font-bold tracking-tight text-white hidden sm:inline">
            Naqsh Couture
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block flex-1">
          <ul className="flex gap-1 list-none m-0 p-0 items-center justify-end">
            {navItems.map((item, index) => (
              <li key={index} className="relative group">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 relative"
                      onClick={() => handleDropdown(index)}
                      style={{
                        color: palette.background,
                      }}
                    >
                      <span className="relative">
                        {item.text}
                        <span
                          className="absolute bottom-0 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                          style={{ backgroundColor: palette.accentButton }}
                        ></span>
                      </span>
                      <span
                        className="text-xs inline-block transition-transform duration-300"
                        style={{
                          transform:
                            activeDropdown === index
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      >
                        ▼
                      </span>
                    </button>
                    {activeDropdown === index && (
                      <div
                        className="absolute top-full left-0 min-w-[220px] rounded-xl overflow-hidden mt-3 shadow-2xl z-50 border"
                        style={{
                          backgroundColor: palette.background,
                          borderColor: palette.accentButton,
                          animation:
                            "slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                        }}
                      >
                        {[1, 2, 3].map((num) => (
                          <Link
                            key={num}
                            to={`/dropdown-item-${num}`}
                            className="block px-5 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden group/item"
                            style={{ color: palette.text }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                palette.accentButton + "15";
                              e.currentTarget.style.paddingLeft = "1.5rem";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.paddingLeft = "1.25rem";
                            }}
                          >
                            <span className="relative z-10">Option {num}</span>
                            <span
                              className="absolute inset-0 w-0 h-full transition-all duration-300 group-hover/item:w-1"
                              style={{ backgroundColor: palette.accentButton }}
                            ></span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative group/link whitespace-nowrap"
                    style={{
                      color: item.primary
                        ? palette.background
                        : item.danger
                        ? "#FF6B6B"
                        : palette.background,
                      backgroundColor: item.primary
                        ? palette.accentButton
                        : "transparent",
                    }}
                    onClick={handleNavClick}
                  >
                    <span className="relative">
                      {item.text}
                      {!item.primary && (
                        <span
                          className="absolute bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover/link:w-full"
                          style={{
                            backgroundColor: item.danger
                              ? "#FF6B6B"
                              : palette.accentButton,
                          }}
                        ></span>
                      )}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 bg-none border-none cursor-pointer p-2 transition-transform duration-300"
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
          className="lg:hidden border-t transition-all duration-300 max-h-96 overflow-y-auto"
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
                  className="block px-6 py-4 text-base font-semibold transition-all duration-200 relative overflow-hidden group"
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

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default MainHeader;
