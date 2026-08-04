import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTachometerAlt,
  FaUserCircle,
  FaBoxOpen,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { getCart } from "../../utils/cartUtils";
import { getWishlist } from "../../utils/wishlistUtils";

const CONTACT = {
  email: "support@stitchpoint.com",
  phone: "+1 (555) 123-4567",
  address: "123 Fashion Street, Textile City",
  social: [
    { platform: "Facebook", url: "https://facebook.com/stitchpoint", Icon: FaFacebookF },
    { platform: "Instagram", url: "https://instagram.com/stitchpoint", Icon: FaInstagram },
  ],
};

const SHOP_CATEGORIES = [
  "Bridal",
  "Embroidery",
  "Casual Wear",
  "Formal Wear",
  "Unstitched",
  "Accessories",
  "Fabric",
  "Fashion",
];

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop", mega: true },
  { to: "/contact", label: "Contact" },
];

const NaqshCoutureNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const megaRef = useRef(null);
  const userMenuRef = useRef(null);
  const megaCloseTimerRef = useRef(null);

  const openMega = () => {
    if (megaCloseTimerRef.current) clearTimeout(megaCloseTimerRef.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    if (megaCloseTimerRef.current) clearTimeout(megaCloseTimerRef.current);
    megaCloseTimerRef.current = setTimeout(() => setMegaOpen(false), 300);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMegaOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (megaCloseTimerRef.current) clearTimeout(megaCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const loadCounts = async () => {
      if (user?.role === "customer") {
        try {
          const [items, wish] = await Promise.all([getCart(), getWishlist()]);
          setCartCount(items.reduce((sum, item) => sum + (item.quantity || 1), 0));
          setWishlistCount(wish.length || 0);
          return;
        } catch {
          return;
        }
      }
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
        const wish = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(wish.length || 0);
      } catch {
        return;
      }
    };
    loadCounts();
  }, [location.pathname, user]);

  useEffect(() => {
    const onStorage = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
      } catch {
        return;
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setSearch("");
    setIsMenuOpen(false);
  };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const dashboardPath = user
    ? user.role === "customer"
      ? "/customer-dashboard"
      : user.role === "manager"
      ? "/manager-dashboard"
      : "/super-admin-dashboard"
    : null;

  const profilePath = user
    ? user.role === "customer"
      ? "/customer-dashboard/profile"
      : user.role === "manager"
      ? "/manager-dashboard/profile"
      : "/super-admin-dashboard/profile"
    : null;

  const ordersPath = user ? `${dashboardPath}/orders` : null;

  const cartPath = user?.role === "customer" ? "/customer-dashboard/cart" : "/cart";
  const wishlistPath = user?.role === "customer" ? "/customer-dashboard/wishlist" : "/wishlist";

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
    : "U";

  const badge = (count) =>
    count > 0 ? (
      <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-black text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center leading-none">
        {count > 99 ? "99+" : count}
      </span>
    ) : null;

  const navLinkClass = (link) => {
    const active = isActive(link.to);
    return `relative py-1.5 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
      active ? "text-gold-500" : "text-white/70 hover:text-white"
    } ${active ? "after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:bg-gold-500" : "after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full"}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-black ${scrolled ? "shadow-lg shadow-black/40" : ""}`}>
      {/* ── Top info bar ─────────────────────────────── */}
      <div className="bg-[#141414] border-b border-white/5 h-8">
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 text-white/55 text-[10.5px] whitespace-nowrap overflow-hidden">
            <a
              href={`mailto:${CONTACT.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-gold-500 transition-colors"
              title="Email"
            >
              <FaEnvelope className="text-[10px] text-gold-500" />
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}
              className="hidden md:flex items-center gap-1.5 hover:text-gold-500 transition-colors"
              title="Phone"
            >
              <FaPhoneAlt className="text-[10px] text-gold-500" />
              {CONTACT.phone}
            </a>
            <span className="hidden xl:flex items-center gap-1.5" title="Location">
              <FaMapMarkerAlt className="text-[10px] text-gold-500" />
              {CONTACT.address}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {CONTACT.social.map((social) => {
              const SocialIcon = social.Icon;
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="text-white/55 hover:text-gold-500 transition-colors"
                >
                  <SocialIcon className="text-xs" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main navbar ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-6">
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
          {NAV_LINKS.map((link) => (
            <li
              key={link.to}
              className="relative"
              onMouseEnter={() => link.mega && openMega()}
              onMouseLeave={() => link.mega && closeMega()}
            >
              <Link to={link.to} className={`${navLinkClass(link)} flex items-center gap-1`}>
                {link.label}
                {link.mega && <FaChevronDown className="text-[8px] opacity-70" />}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden xl:flex flex-1 max-w-md items-center bg-white/5 border border-white/10 rounded-full px-4 h-9 focus-within:border-gold-500/60 transition-colors"
        >
          <FaSearch className="text-[11px] text-white/40 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent border-none outline-none text-white placeholder-white/30 text-[12px] px-3 w-full"
          />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* User dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full border border-white/10 hover:border-gold-500/50 transition-colors"
                  title={user.name}
                >
                  <span className="w-7 h-7 rounded-full bg-gold-500 text-black text-[11px] font-bold flex items-center justify-center">
                    {initials}
                  </span>
                  <span className="hidden lg:block text-left">
                    <span className="block text-[11px] text-white/80 leading-tight max-w-28 truncate">
                      {user.name}
                    </span>
                    <span className="block text-[9px] uppercase tracking-wider text-gold-500 leading-tight">
                      {user.role === "super_admin" ? "Admin" : user.role}
                    </span>
                  </span>
                  <FaChevronDown
                    className={`text-[9px] text-white/50 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="nc-dropdown absolute right-0 top-[calc(100%+8px)] w-56 bg-[#141414] border border-white/10 rounded-lg shadow-2xl shadow-black/60 py-2">
                    <div className="px-4 py-2.5 border-b border-white/10 mb-1">
                      <p className="text-[13px] text-white font-medium truncate">{user.name}</p>
                      <p className="text-[11px] text-white/40">{user.email}</p>
                    </div>
                    <Link to={dashboardPath} className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 hover:text-gold-500 hover:bg-white/5 transition-colors">
                      <FaTachometerAlt className="text-xs" /> Dashboard
                    </Link>
                    {ordersPath && (
                      <Link to={ordersPath} className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 hover:text-gold-500 hover:bg-white/5 transition-colors">
                        <FaBoxOpen className="text-xs" /> My Orders
                      </Link>
                    )}
                    <Link to={profilePath} className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 hover:text-gold-500 hover:bg-white/5 transition-colors">
                      <FaUserCog className="text-xs" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <FaSignOutAlt className="text-xs" /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to={cartPath}
                className={`relative transition-colors ${isActive(cartPath) ? "text-gold-500" : "text-white/50 hover:text-white"}`}
                title="Cart"
              >
                <FaShoppingCart className="text-[15px]" />
                {badge(cartCount)}
              </Link>

              {/* Wishlist */}
              <Link
                to={wishlistPath}
                className={`relative transition-colors ${isActive(wishlistPath) ? "text-gold-500" : "text-white/50 hover:text-white"}`}
                title="Wishlist"
              >
                <FaHeart className="text-[15px]" />
                {badge(wishlistCount)}
              </Link>
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
            {isMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>
      </div>

      {/* ── Mega menu (Shop) ─────────────────────────── */}
      <div
        ref={megaRef}
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        className={`absolute top-full left-0 right-0 bg-[#141414] border-t border-white/10 shadow-2xl shadow-black/60 transition-all duration-200 ${
          megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-6 grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500 font-semibold mb-4">
              Shop by Category
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMegaOpen(false)}
                  className="text-[13px] text-white/70 hover:text-gold-500 transition-colors py-1 border-b border-white/5 hover:border-gold-500/40 flex items-center justify-between"
                >
                  {cat}
                  <FaChevronDown className="text-[8px] -rotate-90 opacity-40" />
                </Link>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <Link
              to="/shop"
              onClick={() => setMegaOpen(false)}
              className="block h-full bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg p-6 hover:opacity-90 transition-opacity"
            >
              <p className="text-black text-lg font-serif font-semibold leading-snug">
                Explore Our
                <br />
                Full Collection
              </p>
              <p className="text-black/70 text-xs mt-2">
                Handcrafted pieces from artisans across the country.
              </p>
              <span className="inline-block mt-4 bg-black text-gold-500 text-xs font-semibold px-4 py-1.5 rounded-full">
                Shop All →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────── */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 max-h-[calc(100vh-88px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-4">
            <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 h-9 mb-4 focus-within:border-gold-500/60">
              <FaSearch className="text-[11px] text-white/40 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-white placeholder-white/30 text-[12px] px-3 w-full"
              />
            </form>

            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`block py-2.5 text-sm font-medium transition-colors ${isActive(link.to) ? "text-gold-500" : "text-white/60 hover:text-white"}`}
                  >
                    {link.label}
                  </Link>
                  {link.mega && (
                    <div className="pl-4 pb-2 grid grid-cols-2 gap-1">
                      {SHOP_CATEGORIES.map((cat) => (
                        <Link
                          key={cat}
                          to={`/shop?category=${encodeURIComponent(cat)}`}
                          className="block py-1.5 text-[12px] text-white/45 hover:text-gold-500 transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {user ? (
              <div className="border-t border-white/10 mt-3 pt-3 space-y-1">
                <p className="text-[12px] text-white/40 mb-1 px-1">
                  Signed in as <span className="text-gold-500">{user.name}</span>
                </p>
                <Link to={dashboardPath} className="flex items-center gap-2 py-2 text-sm text-white/60 hover:text-gold-500 transition-colors">
                  <FaTachometerAlt className="text-xs" /> Dashboard
                </Link>
                {ordersPath && (
                  <Link to={ordersPath} className="flex items-center gap-2 py-2 text-sm text-white/60 hover:text-gold-500 transition-colors">
                    <FaBoxOpen className="text-xs" /> My Orders
                  </Link>
                )}
                <Link to={profilePath} className="flex items-center gap-2 py-2 text-sm text-white/60 hover:text-gold-500 transition-colors">
                  <FaUserCog className="text-xs" /> Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 py-2 text-sm text-red-400 transition-colors">
                  <FaSignOutAlt className="text-xs" /> Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 mt-3 pt-3 flex items-center gap-3">
                <Link to="/login" className="flex-1 text-center text-sm text-white/70 border border-white/20 py-2 rounded transition-colors hover:text-white hover:border-white/50">
                  Login
                </Link>
                <Link to="/signup" className="flex-1 text-center text-sm bg-gold-500 text-black py-2 rounded font-semibold hover:bg-gold-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NaqshCoutureNavbar;
