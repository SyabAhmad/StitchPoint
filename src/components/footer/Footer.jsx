import { Link } from "react-router-dom";
import COLOR_PALETTES from "../../../theme";

const Footer = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: palette.primaryHeader }}>
      {/* Newsletter Section */}
      <div className="px-6 lg:px-12 py-12 border-b" style={{ borderColor: palette.accentButton }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get exclusive offers and new collections delivered to your inbox</p>
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/40 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: palette.accentButton,
                  color: palette.primaryHeader,
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: palette.accentButton }}
                >
                  NC
                </div>
                <h4 className="text-xl font-bold text-white">Naqsh Couture</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Celebrating artisanal craftsmanship and handmade excellence.
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-white hover:text-yellow-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-yellow-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-yellow-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8a4 4 0 110 8 4 4 0 010-8z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-white font-semibold mb-4">Shop</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/new" className="text-gray-400 hover:text-white transition-colors text-sm">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/best-sellers" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link to="/sale" className="text-gray-400 hover:text-white transition-colors text-sm">
                    On Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t" style={{ borderColor: palette.accentButton + "40" }}>
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} Naqsh Couture. All rights reserved.
              </p>
              <div className="flex gap-4">
                <span className="text-gray-400 text-sm">Secure Payments:</span>
                <div className="flex gap-2">
                  {["Visa", "Mastercard", "PayPal"].map((method) => (
                    <div
                      key={method}
                      className="px-3 py-1 bg-white/10 rounded text-xs text-gray-300"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
