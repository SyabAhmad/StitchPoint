import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../utils/wishlistUtils";
import toast from "react-hot-toast";

// Loading Skeleton Component
const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gold-500/10 animate-pulse">
    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
    <div className="p-4">
      <div className="h-5 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
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
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(30); // Default to 30 as requested
  const [totalProducts, setTotalProducts] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showFilters, setShowFilters] = useState(true); // Show/hide filters panel
  const [activeQuickFilter, setActiveQuickFilter] = useState(null); // Track active quick filter
  const [categorySearch, setCategorySearch] = useState(""); // Search term for categories
  const [districtSearch, setDistrictSearch] = useState(""); // Search term for districts
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      // Fetch wishlist
      try {
        const items = await getWishlist();
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }

      // Fetch products (merged directly to avoid an unused nested function and recursive call)
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          per_page: perPage.toString(),
        });

        const response = await fetch(
          `http://127.0.0.1:5000/api/products?${queryParams.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const prods = data.products || [];
        setProducts(prods);
        setFilteredProducts(prods);
        setTotalProducts(data.total || 0);

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

    // Invoke the wrapper to run wishlist + product fetch
    fetchProductsAndWishlist();
  }, [currentPage, perPage]);

  const [sortBy, setSortBy] = useState("name");

  // Calculate pagination info
  const totalPages = Math.ceil(totalProducts / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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

    if (selectedDistrict) {
      filtered = filtered.filter(
        (product) => product.district === selectedDistrict
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
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    selectedDistrict,
    priceRange,
    products,
    sortBy,
  ]);

  const categories = [...new Set(products.map((product) => product.category))];
  const districts = [
    ...new Set(products.map((product) => product.district).filter(Boolean)),
  ];

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
      // Check if product is already in wishlist
      const isInWishlist = wishlistItems.some((item) => item.id === product.id);

      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(product.id);
        toast.success(`${product.name} removed from wishlist!`);
        // Update local state
        setWishlistItems(
          wishlistItems.filter((item) => item.id !== product.id)
        );
      } else {
        // Add to wishlist
        await addToWishlist(product);
        toast.success(`${product.name} added to wishlist!`);
        // Update local state
        const updatedWishlist = await getWishlist();
        setWishlistItems(updatedWishlist);
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  // Apply quick filter function
  const applyQuickFilter = (filterType) => {
    setActiveQuickFilter(filterType);
    
    switch(filterType) {
      case "newest":
        setSortBy("newest");
        setPriceRange([0, 1000]);
        setSelectedCategory("");
        setSelectedDistrict("");
        break;
      case "trending":
        setSortBy("name");
        setPriceRange([0, 500]);
        setSelectedCategory("");
        setSelectedDistrict("");
        break;
      case "premium":
        setSortBy("price-high");
        setPriceRange([500, 1000]);
        setSelectedCategory("");
        setSelectedDistrict("");
        break;
      case "deals":
        setSortBy("price-low");
        setPriceRange([0, 300]);
        setSelectedCategory("");
        setSelectedDistrict("");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Header Section with Search */}
        <div className="bg-gradient-to-br from-gold-500/5 via-white to-gold-500/5 py-8 px-4 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-3 tracking-tight">
              Our Collections
            </h1>
            <p className="text-sm md:text-base text-black/70 max-w-xl mx-auto leading-relaxed font-light mb-5">
              Discover timeless elegance in our curated selection of couture
              pieces.
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Skeletons */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
        <div className="py-12 px-4 text-center bg-gradient-to-br from-gold-500/2 to-white/98">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-4">
            Collections
          </h1>
          <p className="text-base md:text-lg text-black/70">
            Error loading collections: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section with Enhanced Search */}
      <div className="bg-gradient-to-br from-gold-500/5 via-white to-gold-500/5 py-8 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold-500 mb-3 tracking-tight">
            Our Collections
          </h1>
          <p className="text-sm md:text-base text-black/70 max-w-xl mx-auto leading-relaxed font-light mb-5">
            Discover timeless elegance in our curated selection of couture pieces.
          </p>

          {/* Enhanced Search with Suggestions */}
          <div className="relative max-w-2xl mx-auto mb-4">
            <div className="flex items-center bg-white rounded-full shadow-lg border border-gold-500/30 overflow-hidden">
              <input
                type="text"
                placeholder="Search by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-5 py-3 focus:outline-none text-base"
              />
              <button className="px-5 py-3 bg-gold-500 text-black font-bold hover:bg-gold-600 transition-colors">
                🔍
              </button>
            </div>

            {/* Popular Search Suggestions */}
            <div className="mt-3 text-sm text-gray-600">
              Popular searches:
              <span className="ml-2">
                {["Dresses", "Bridal", "Formal Wear"].map((term, index) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="inline-block mx-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gold-100 hover:text-gold-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Enhanced Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Pills Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-6 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            {/* Active Filter Tags */}
            {(searchTerm || selectedCategory || selectedDistrict || priceRange[0] > 0 || priceRange[1] < 1000 || activeQuickFilter) && (
              <>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gold-100 text-gold-800">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 text-gold-600 hover:text-gold-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gold-100 text-gold-800">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="ml-2 text-gold-600 hover:text-gold-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedDistrict && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gold-100 text-gold-800">
                    District: {selectedDistrict}
                    <button
                      onClick={() => setSelectedDistrict("")}
                      className="ml-2 text-gold-600 hover:text-gold-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gold-100 text-gold-800">
                    Price: {priceRange[0]} - {priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 1000])}
                      className="ml-2 text-gold-600 hover:text-gold-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {activeQuickFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gold-100 text-gold-800">
                    {activeQuickFilter === "newest" && "🎉 New Arrivals"}
                    {activeQuickFilter === "trending" && "🔥 Trending Now"}
                    {activeQuickFilter === "premium" && "💎 Premium Collection"}
                    {activeQuickFilter === "deals" && "💰 Best Deals"}
                    <button
                      onClick={() => setActiveQuickFilter(null)}
                      className="ml-2 text-gold-600 hover:text-gold-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedDistrict("");
                    setPriceRange([0, 1000]);
                    setSortBy("name");
                    setCurrentPage(1);
                    setActiveQuickFilter(null);
                  }}
                  className="text-sm text-gray-600 hover:text-black font-medium"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters ? (
          <div className="bg-gradient-to-br from-white to-gold-50/20 rounded-3xl shadow-xl border border-gold-500/20 p-6 mb-8 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-gold-600 hover:text-gold-800 font-medium flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all hover:bg-gold-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Hide Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {/* Category Filter */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gold-500/10">
                <label className="block mb-3 font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Category
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {categories.slice(0, 5).map((category) => (
                    <label key={category} className="flex items-center cursor-pointer hover:bg-gold-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2 text-gold-600 focus:ring-gold-500 w-4 h-4"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                  {categories.length > 5 && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-sm"
                    >
                      <option value="">More Categories...</option>
                      {categories.slice(5).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* District Filter */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gold-500/10">
                <label className="block mb-3 font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  District/Area
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {districts.slice(0, 5).map((district) => (
                    <label key={district} className="flex items-center cursor-pointer hover:bg-gold-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="district"
                        value={district}
                        checked={selectedDistrict === district}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="mr-2 text-gold-600 focus:ring-gold-500 w-4 h-4"
                      />
                      <span className="text-sm">{district}</span>
                    </label>
                  ))}
                  {districts.length > 5 && (
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-sm"
                    >
                      <option value="">More Districts...</option>
                      {districts.slice(5).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gold-500/10">
                <label className="block mb-3 font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">to</span>
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-sm"
                      placeholder="Max"
                    />
                  </div>

                  {/* Price Range Slider */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>PKR 0</span>
                      <span>PKR 1000+</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-gold-500 rounded-full"
                        style={{
                          left: `${(priceRange[0] / 1000) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Filter Tags */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gold-500/10">
                <label className="block mb-3 font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Quick Filters
                </label>
                <div className="space-y-2">
                  <button 
                    onClick={() => applyQuickFilter("newest")}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                      activeQuickFilter === "newest" 
                        ? "bg-gold-100 text-gold-700 shadow-sm border border-gold-200" 
                        : "bg-gray-50 hover:bg-gold-50 hover:text-gold-700"
                    }`}
                  >
                    🎉 New Arrivals
                  </button>
                  <button 
                    onClick={() => applyQuickFilter("trending")}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                      activeQuickFilter === "trending" 
                        ? "bg-gold-100 text-gold-700 shadow-sm border border-gold-200" 
                        : "bg-gray-50 hover:bg-gold-50 hover:text-gold-700"
                    }`}
                  >
                    🔥 Trending Now
                  </button>
                  <button 
                    onClick={() => applyQuickFilter("premium")}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                      activeQuickFilter === "premium" 
                        ? "bg-gold-100 text-gold-700 shadow-sm border border-gold-200" 
                        : "bg-gray-50 hover:bg-gold-50 hover:text-gold-700"
                    }`}
                  >
                    💎 Premium Collection
                  </button>
                  <button 
                    onClick={() => applyQuickFilter("deals")}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                      activeQuickFilter === "deals" 
                        ? "bg-gold-100 text-gold-700 shadow-sm border border-gold-200" 
                        : "bg-gray-50 hover:bg-gold-50 hover:text-gold-700"
                    }`}
                  >
                    💰 Best Deals
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowFilters(true)}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-8 text-gold-600 hover:text-gold-800 font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Show Filters
          </button>
        )}

        {/* Products Grid with Enhanced Controls */}
        <main>
          {/* Results Header with View Toggle */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-700 font-medium">
                <span className="font-bold">{filteredProducts.length}</span> results
                {searchTerm && (
                  <span className="ml-2 text-gray-500">
                    for "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === "grid" ? "bg-white shadow-sm" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                    </svg>
                    Grid
                  </span>
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    List
                  </span>
                </button>
              </div>

              {/* Per Page Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Per Page:</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                >
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="60">60</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* View Toggle and Product Count */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-700 text-sm font-medium">
                Showing <span className="font-bold">{startIndex + 1}-{Math.min(endIndex, totalProducts)}</span> of <span className="font-bold">{totalProducts}</span> products
              </p>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === "grid" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    List
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 text-sm">Per Page:</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-sm"
                >
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="60">60</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700 text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-sm"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white via-gold-50/30 to-white shadow-lg border border-gold-500/20 group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out transform hover:scale-102"
                >
                  {/* Premium Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Premium
                  </div>

                  {/* Wishlist Button */}
                  <button
                    className={`absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                      wishlistItems.some((item) => item.id === product.id)
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    <span className="text-lg">
                      {wishlistItems.some((item) => item.id === product.id)
                        ? "❤️"
                        : "🤍"}
                    </span>
                  </button>

                  <div
                    className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
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

                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-bold text-black leading-tight font-serif line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-xs font-semibold text-black/70">
                            4.8
                          </span>
                        </div>
                      </div>

                      <p className="text-black/80 mb-2 leading-relaxed text-xs line-clamp-1">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gold-600 font-bold text-sm">
                          PKR {product.price}
                        </p>
                        <div className="text-right">
                          <p className="text-black/70 text-xs font-medium">
                            Stock:{" "}
                            <span className="text-green-600 font-bold">
                              {product.stock_quantity}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-black text-yellow-500 px-2 py-1.5 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase text-xs tracking-wide"
                        onClick={() => handleAddToCart(product)}
                      >
                        🛒 Add
                      </button>
                      <button
                        className="bg-white border border-gold-500 text-gold-600 px-2 py-1.5 rounded-lg font-bold hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
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
          ) : (
            <div className="space-y-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div
                        className="md:w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.image_url ? (
                          <img
                            src={`http://127.0.0.1:5000${product.image_url}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
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
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-900 leading-tight font-serif">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 text-sm">⭐</span>
                              <span className="text-sm font-semibold text-gray-700">
                                4.8
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <p className="text-gold-600 font-bold text-lg">
                              PKR {product.price}
                            </p>
                            <div className="text-right">
                              <p className="text-gray-700 text-sm font-medium">
                                Stock:{" "}
                                <span className="text-green-600 font-bold">
                                  {product.stock_quantity}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                          <button
                            className="flex-1 bg-black text-yellow-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase text-sm tracking-wide"
                            onClick={() => handleAddToCart(product)}
                          >
                            🛒 Add to Cart
                          </button>
                          <button
                            className="bg-white border border-gold-500 text-gold-600 px-4 py-2 rounded-lg font-bold hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            onClick={() => handleProductClick(product)}
                          >
                            👁️ View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-black/60 bg-white rounded-3xl shadow-xl border border-gold-500/10">
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
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: currentPage === 1 ? "#cccccc" : "#d4af37",
                  color: currentPage === 1 ? "#666666" : "#000000",
                }}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const isCurrentPage = currentPage === pageNumber;
                const isNearCurrent = Math.abs(currentPage - pageNumber) <= 2;
                const isFirstOrLast =
                  pageNumber === 1 || pageNumber === totalPages;

                // Show first page, last page, current page, and pages near current
                if (isFirstOrLast || isCurrentPage || isNearCurrent) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className="px-4 py-2 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: isCurrentPage ? "#d4af37" : "#f3f4f6",
                        color: isCurrentPage ? "#000000" : "#374151",
                        border: "1px solid #d4af37",
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                }

                // Show ellipsis for gaps
                if (
                  pageNumber === currentPage - 3 ||
                  pageNumber === currentPage + 3
                ) {
                  return (
                    <span key={pageNumber} className="px-2 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    currentPage === totalPages ? "#cccccc" : "#d4af37",
                  color: currentPage === totalPages ? "#666666" : "#000000",
                }}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Product details are now shown on a separate page at /product/:id */}
    </div>
  );
}
