// data.js
const APP_DATA = {
  // Navigation bars
  navbars: {
    beforeSignin: [
      { text: "Home", href: "/" },
      { text: "Shop All", href: "/shop" },
      {
        text: "Categories",
        href: "/categories",
        primary: false,
        dropdown: true, // Optional: if you want to show sub-menu on hover/click
      },
      { text: "New Arrivals", href: "/new" },
      { text: "Best Sellers", href: "/best-sellers" },
      { text: "About", href: "/about" },
      { text: "Contact", href: "/contact" },
      { text: "Sell on Naqsh Couture", href: "/auth", primary: true }, // 👈 Link to seller signup
      { text: "Login", href: "/auth", primary: false }, // Link to auth page
    ],
    afterSignin: [
      { text: "Dashboard", href: "/dashboard" },
      { text: "Profile", href: "/seller/profile" },
      { text: "Settings", href: "/settings" },
      { text: "Logout", href: "/logout", danger: true },
    ],
  },

  // Footer links
  footer: {
    quickLinks: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
      { text: "FAQ", href: "/faq" },
    ],
    social: [
      { text: "Twitter", href: "https://twitter.com" },
      { text: "Facebook", href: "https://facebook.com" },
      { text: "Instagram", href: "https://instagram.com" },
    ],
  },

  // Page content
  pages: {
    home: {
      hero: {
        title: "Welcome to Our Platform",
        subtitle: "The best solution for your needs",
        cta: { text: "Get Started", href: "/signup" },
      },
      features: [
        { title: "Feature 1", desc: "Description of feature 1" },
        { title: "Feature 2", desc: "Description of feature 2" },
        { title: "Feature 3", desc: "Description of feature 3" },
      ],
    },
    about: {
      sections: [
        { title: "Our Story", content: "About our company history..." },
        { title: "Our Mission", content: "About our mission..." },
      ],
    },
  },

  // User-specific data
  user: {
    defaultAvatar: "/images/default-avatar.png",
    maxUploadSize: 5242880, // 5MB in bytes
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
  },

  // Application settings
  settings: {
    appName: "MyApp",
    version: "1.0.0",
    contactEmail: "support@example.com",
    apiEndpoint: "https://api.example.com",
  },
};

// Helper function to access data paths
function getData(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], APP_DATA);
}

// Color palettes for luxury couture
const COLOR_PALETTES = {
  black: '#151515',
  gold: '#D4AF37',
  white: '#FFFFFF',
};

export { APP_DATA, getData, COLOR_PALETTES };
