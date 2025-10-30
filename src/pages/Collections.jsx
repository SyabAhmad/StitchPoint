import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";

// Loading Skeleton Component
const ProductSkeleton = () => (
  <div className="rounded-3xl overflow-hidden bg-white shadow-xl border border-gold-500/10 animate-pulse">
    <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-300"></div>
    <div className="p-7">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded mb-3"></div>
      <div className="flex gap-3">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const prods = data.products || [];
        setProducts(prods);
        setFilteredProducts(prods);

        // Dynamically set priceRange to cover all returned products so filtering
        // doesn't accidentally hide most items when default range is narrow.
        if (prods.length > 0) {
          const prices = prods.map((p) => Number(p.price) || 0);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([Math.floor(min), Math.ceil(max)]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    let filtered = products.filter((product) => {
      const name = (product.name || "").toString();
      const description = (product.description || "").toString();
      const term = (searchTerm || "").toString().toLowerCase();
      return (
        name.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term)
      );
    });

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price-low") {
        return a.price - b.price;
      } else if (sortBy === "price-high") {
        return b.price - a.price;
      } else if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, products, sortBy]);

  const categories = [...new Set(products.map((product) => product.category))];

  const handleProductClick = (product) => {
    // Navigate to product details page instead of opening an in-page modal
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Header Section with Search */}
        <div className="bg-gradient-to-br from-gold-500/5 via-white to-gold-500/5 py-16 px-4 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-gold-500 mb-4 tracking-tight">
              Our Collections
            </h1>
            <p className="text-md md:text-lg text-black/70 max-w-xl mx-auto leading-relaxed font-light mb-6">
              Discover timeless elegance in our curated selection of couture
              pieces.
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Skeletons */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters Sidebar Skeleton */}
          <aside className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gold-500/10 p-8 h-fit sticky top-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="mb-7">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="mb-8">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
                <div className="w-6 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </aside>

          {/* Products Grid Skeletons */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-40"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="py-16 px-4 text-center bg-gradient-to-br from-gold-500/2 to-white/98">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gold-500 mb-4">
            Collections
          </h1>
          <p className="text-lg md:text-xl text-black/70">
            Error loading collections: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section with Search */}
      <div className="bg-gradient-to-br from-gold-500/5 via-white to-gold-500/5 py-16 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gold-500 mb-4 tracking-tight">
            Our Collections
          </h1>
          <p className="text-md md:text-lg text-black/70 max-w-xl mx-auto leading-relaxed font-light mb-6">
            Discover timeless elegance in our curated selection of couture
            pieces.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-lg px-5 py-3 border border-gold-500/30 rounded-full focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors shadow-lg text-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Horizontal Filters Bar */}
        <div className="bg-white rounded-3xl shadow-xl border border-gold-500/10 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Category Filter */}
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-2 mb-2 font-semibold text-black/80 text-sm uppercase tracking-wider">
                <span className="text-gold-500">🏷️</span> Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gold-500/30 rounded-xl bg-white cursor-pointer appearance-none focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 text-base hover:border-gold-400"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-2 mb-2 font-semibold text-black/80 text-sm uppercase tracking-wider">
                <span className="text-gold-500">💰</span> Price Range
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ])
                  }
                  className="flex-1 px-3 py-2 border border-gold-500/30 rounded-xl text-center focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 text-base hover:border-gold-400"
                  placeholder="Min"
                />
                <span className="text-gold-500 font-bold text-lg">-</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value) || 1000,
                    ])
                  }
                  className="flex-1 px-3 py-2 border border-gold-500/30 rounded-xl text-center focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 text-base hover:border-gold-400"
                  placeholder="Max"
                />
              </div>
              <div className="mt-2 text-sm text-black/60 text-center font-medium">
                PKR {priceRange[0]} - PKR {priceRange[1]}
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex-shrink-0">
              <button
                className="w-full lg:w-auto px-6 py-3 bg-gray-100 text-black/70 border border-gold-500/20 rounded-xl font-bold hover:bg-gold-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg uppercase tracking-wide text-sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setPriceRange([0, 1000]);
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <main>
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <p className="text-black/70 text-lg font-medium">
              Showing{" "}
              <span className="font-bold">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-3">
              <label className="font-semibold text-black/80 text-sm uppercase tracking-wider">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gold-500/30 rounded-xl bg-white cursor-pointer appearance-none focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 text-base"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-gold-50/30 to-white shadow-2xl border border-gold-500/20 group hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 ease-out transform hover:scale-105"
                >
                  {/* Premium Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Premium
                  </div>

                  {/* Wishlist Button */}
                  <button
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 p-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    onClick={() => handleAddToWishlist(product)}
                  >
                    <span className="text-lg">❤️</span>
                  </button>

                  <div
                    className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.image_url ? (
                      <img
                        src={`http://127.0.0.1:5000${product.image_url}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${
                        product.image_url ? "hidden" : "flex"
                      } bg-gradient-to-br from-gold-100 to-gold-200`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <span className="text-white text-2xl font-bold">
                            {product.name &&
                            product.name.charAt &&
                            product.name.charAt(0)
                              ? product.name.charAt(0).toUpperCase()
                              : "?"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                          No Image Available
                        </p>
                      </div>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full">
                        View Details
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-bold text-black leading-tight font-serif">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-xs font-semibold text-black/70">
                            4.8
                          </span>
                        </div>
                      </div>

                      <p className="text-black/80 mb-3 leading-relaxed text-sm line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gold-600 font-bold text-xl">
                          PKR {product.price}
                        </p>
                        <div className="text-right">
                          <p className="text-black/70 text-xs font-medium">
                            Stock:{" "}
                            <span className="text-green-600 font-bold">
                              {product.stock_quantity}
                            </span>
                          </p>
                          {product.store_name && (
                            <p className="text-black/50 text-xs mt-1">
                              By: {product.store_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-2 rounded-xl font-bold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase text-xs tracking-wide"
                        onClick={() => handleAddToCart(product)}
                      >
                        🛒 Add to Cart
                      </button>
                      <button
                        className="bg-white border-2 border-gold-500 text-gold-600 px-4 py-2 rounded-xl font-bold hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base"
                        onClick={() => handleProductClick(product)}
                      >
                        👁️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-black/60 bg-white rounded-3xl shadow-xl border border-gold-500/10">
                <p className="text-2xl font-semibold mb-4 text-gold-500">
                  No products found!
                </p>
                <p className="text-lg mb-3">
                  It seems there are no items matching your current criteria.
                </p>
                <p className="text-md">
                  Try broadening your search or clearing some filters.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product details are now shown on a separate page at /product/:id */}
    </div>
  );
}
