// colors.js

const COLOR_PALETTES = {
  // 🎨 Palette 1: “Artisan Earth” — Warm & Organic
  artisanEarth: {
    name: "Artisan Earth",
    primaryHeader: "#4A3F35", // Deep Warm Brown
    background: "#F8F5F0", // Soft Cream/Off-White
    accentButton: "#D4A76A", // Burnt Honey
    text: "#2E2823", // Dark Charcoal
    hoverHighlight: "#E9D7C6", // Light Beige
    secondaryAccent: "#B88E5D", // Deeper Honey (optional)
  },
  luxuryCouture: {
    name: "luxury Couture",
    primaryHeader: "#151515",
    background: "#FFFFFF",
    accentButton: "#D4AF37",
    text: "#151515",
    hoverHighlight: "#F5F5F5",
  },

  // 🎨 Palette 2: “Modern Craft” — Clean + Sophisticated
  modernCraft: {
    name: "Modern Craft",
    primaryHeader: "#2C3E50", // Navy Blue-Grey
    background: "#FFFFFF", // Pure White
    accentButton: "#E67E22", // Vibrant Tangerine
    text: "#34495E", // Slate Grey
    hoverHighlight: "#F5F5F5", // Light Grey
    secondaryAccent: "#D35400", // Deeper Orange (optional)
  },

  // 🎨 Palette 3: “Botanical Stitch” — Soft & Feminine / Unisex Friendly
  botanicalStitch: {
    name: "Botanical Stitch",
    primaryHeader: "#6B8E23", // Olive Green
    background: "#F9FBE7", // Pale Lemon Cream
    accentButton: "#D81B60", // Rose Pink
    text: "#444444", // Medium Grey
    hoverHighlight: "#EDEBD7", // Subtle Sage
    secondaryAccent: "#556B2F", // Darker Olive (optional)
  },

  // 🎨 Palette 4: “Midnight Thread” — Luxury & Minimalist
  midnightThread: {
    name: "Midnight Thread",
    primaryHeader: "#1A1A2E", // Deep Midnight Blue
    background: "#F0F0F0", // Cool Light Grey
    accentButton: "#FF6B6B", // Coral Red
    text: "#333333", // Dark Grey
    hoverHighlight: "#E5E5E5", // Lighter Grey
    secondaryAccent: "#FF4757", // Brighter Coral (optional)
  },

  // 🎨 Palette 5: “Terracotta Studio” — Bold & Artistic
  terracottaStudio: {
    name: "Terracotta Studio",
    primaryHeader: "#8B4513", // Rich Terracotta
    background: "#FFF8F0", // Warm Ivory
    accentButton: "#FFD700", // Gold
    text: "#2B2B2B", // Charcoal Black
    hoverHighlight: "#FFEBCD", // Antique White
    secondaryAccent: "#CD853F", // Saddle Brown (optional)
  },
};


export default COLOR_PALETTES;

// // 👇 Optional: Export a default palette for quick use
// export const DEFAULT_PALETTE = COLOR_PALETTES.artisanEarth;

// // 👇 Or pick your favorite by name
// export const CURRENT_PALETTE = COLOR_PALETTES.modernCraft; // ← Change this line to switch palettes!