import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../utils/wishlistUtils";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const quickFilters = {
  az: {
    label: "A-Z",
    action: (
      setSortBy,
      setPriceRange,
      setSelectedCategory,
      setSelectedDistrict,
      setActiveQuickFilter
    ) => {
      setSortBy("name");
      setPriceRange([0, 10000]);
      setSelectedCategory("");
      setSelectedDistrict("");
      setActiveQuickFilter("az");
    },
    isActive: (sortBy, priceRange, selectedCategory, selectedDistrict) =>
      sortBy === "name" && !selectedCategory && !selectedDistrict,
  },
  priceLow: {
    label: "LOW TO HIGH",
    action: (
      setSortBy,
      setPriceRange,
      setSelectedCategory,
      setSelectedDistrict,
      setActiveQuickFilter
    ) => {
      setSortBy("price-low");
      setPriceRange([0, 10000]);
      setSelectedCategory("");
      setSelectedDistrict("");
      setActiveQuickFilter("priceLow");
    },
    isActive: (sortBy, priceRange, selectedCategory, selectedDistrict) =>
      sortBy === "price-low" && !selectedCategory && !selectedDistrict,
  },
  priceHigh: {
    label: "HIGH TO LOW",
    action: (
      setSortBy,
      setPriceRange,
      setSelectedCategory,
      setSelectedDistrict,
      setActiveQuickFilter
    ) => {
      setSortBy("price-high");
      setPriceRange([0, 10000]);
      setSelectedCategory("");
      setSelectedDistrict("");
      setActiveQuickFilter("priceHigh");
    },
    isActive: (sortBy, priceRange, selectedCategory, selectedDistrict) =>
      sortBy === "price-high" && !selectedCategory && !selectedDistrict,
  },
  newest: {
    label: "NEWEST",
    action: (
      setSortBy,
      setPriceRange,
      setSelectedCategory,
      setSelectedDistrict,
      setActiveQuickFilter
    ) => {
      setSortBy("newest");
      setPriceRange([0, 10000]);
      setSelectedCategory("");
      setSelectedDistrict("");
      setActiveQuickFilter("newest");
    },
    isActive: (sortBy, priceRange, selectedCategory, selectedDistrict) =>
      sortBy === "newest" && !selectedCategory && !selectedDistrict,
  },
};

const ProductSkeleton = () => (
  <div className="bg-white border border-black/10">
    <div className="h-48 bg-gray-100 animate-pulse"></div>
    <div className="p-4">
      <div className="h-5 bg-gray-100 rounded mb-2"></div>
      <div className="h-3 bg-gray-100 rounded mb-1"></div>
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-3"></div>
      <div className="h-6 bg-gray-100 rounded"></div>
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
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDistrict("");
    setPriceRange([0, maxPrice]);
    setSortBy("name");
    setActiveQuickFilter(null);
    setCurrentPage(1);
  };

  const applyQuickFilter = (filterKey) => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDistrict("");
    setCurrentPage(1);

    quickFilters[filterKey].action(
      setSortBy,
      setPriceRange,
      setSelectedCategory,
      setSelectedDistrict,
      setActiveQuickFilter
    );
  };

  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
        const items = await getWishlist();
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }

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

        if (prods.length > 0) {
          const prices = prods
            .map((p) => Number(p.price) || 0)
            .filter((p) => p >= 0);
          if (prices.length > 0) {
            const min = Math.max(0, Math.floor(Math.min(...prices) / 10) * 10);
            const max = Math.ceil(Math.max(...prices) / 10) * 10;
            const safeMax = Math.min(max, 10000);
            setPriceRange([min, safeMax]);
            setMaxPrice(safeMax);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndWishlist();
  }, [currentPage, perPage]);

  useEffect(() => {
    if (activeQuickFilter) {
      const currentFilter = quickFilters[activeQuickFilter];
      if (!currentFilter.isActive) {
        setActiveQuickFilter(null);
      }
    }
  }, [
    searchTerm,
    selectedCategory,
    selectedDistrict,
    priceRange,
    sortBy,
    activeQuickFilter,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
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
    if (product && product.id) {
      try {
        fetch(`${API_BASE}/api/analytics/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: product.id,
            action: "click",
          }),
        });
      } catch (e) { /* ignore analytics errors */ }
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      addToCart(product);
      try {
        await fetch(`${API_BASE}/api/analytics/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: product.id,
            action: "add_to_cart",
          }),
        });
      } catch (e) { /* ignore analytics errors */ }
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const isInWishlist = wishlistItems.some((item) => item.id === product.id);

      if (isInWishlist) {
        await removeFromWishlist(product.id);
        toast.success(`${product.name} removed from wishlist!`);
        setWishlistItems(
          wishlistItems.filter((item) => item.id !== product.id)
        );
      } else {
        await addToWishlist(product);
        toast.success(`${product.name} added to wishlist!`);
        const updatedWishlist = await getWishlist();
        setWishlistItems(updatedWishlist);
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const renderStars = (rating, reviewCount) => {
    if (!rating || rating === 0) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">No reviews</span>
        </div>
      );
    }
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-black" size={12} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-black opacity-50" size={12} />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" size={12} />);
      }
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-xs text-black/60">({reviewCount})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black py-16 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-[0.3em]" style={{ fontFamily: '"Playfair Display", serif' }}>
            COLLECTIONS
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Discover timeless elegance in our curated selection of couture pieces.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 bg-white border border-black/10 p-6 h-fit">
            <div className="h-8 bg-gray-100 rounded mb-8"></div>
            <div className="h-12 bg-gray-100 rounded-xl mb-4"></div>
            <div className="h-12 bg-gray-100 rounded-xl"></div>
          </aside>

          <main className="lg:col-span-3">
            <div className="h-6 bg-gray-100 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-4 tracking-widest">ERROR</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-[0.3em]" style={{ fontFamily: '"Playfair Display", serif' }}>
          COLLECTIONS
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Discover timeless elegance in our curated selection of couture pieces.
        </p>

        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex items-center bg-white border border-white/20 overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-black font-bold tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors">
              SEARCH
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showFilters && (
          <div className="bg-white border border-black/10 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-black tracking-widest uppercase">FILTERS</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-black/60 hover:text-black underline"
                >
                  CLEAR ALL
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-sm text-black/60 hover:text-black underline"
                >
                  HIDE
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block mb-3 font-bold text-black text-sm tracking-widest uppercase">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black focus:outline-none text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-3 font-bold text-black text-sm tracking-widest uppercase">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black focus:outline-none text-sm"
                >
                  <option value="">All Districts</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-3 font-bold text-black text-sm tracking-widest uppercase">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="flex-1 px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) || maxPrice,
                      ])
                    }
                    className="flex-1 px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-3 font-bold text-black text-sm tracking-widest uppercase">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black focus:outline-none text-sm"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="w-full border border-black/20 py-3 mb-8 text-black font-bold tracking-widest uppercase text-sm hover:bg-black hover:text-white transition-colors"
          >
            SHOW FILTERS
          </button>
        )}

        <main>
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <p className="text-black/60 text-sm">
              <span className="font-bold text-black">{filteredProducts.length}</span> PRODUCTS
            </p>

            <div className="flex items-center gap-3">
              <label className="text-sm text-black/60">SORT:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-black/20 bg-transparent focus:border-black focus:outline-none text-sm"
              >
                <option value="name">A-Z</option>
                <option value="price-low">LOW TO HIGH</option>
                <option value="price-high">HIGH TO LOW</option>
                <option value="newest">NEWEST</option>
              </select>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-black/10 hover:border-black/30 transition-all duration-300"
                  >
                    <button
                      className={`absolute top-3 right-3 z-10 p-1 transition-colors ${
                        wishlistItems.some((item) => item.id === product.id)
                          ? "text-red-600"
                          : "text-gray-400 hover:text-black"
                      }`}
                      onClick={() => handleAddToWishlist(product)}
                    >
                      <span className="text-xl">
                        {wishlistItems.some((item) => item.id === product.id)
                          ? "♥"
                          : "♡"}
                      </span>
                    </button>

                    <div
                      className="h-56 bg-gray-50 flex items-center justify-center cursor-pointer relative overflow-hidden"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.image_url ? (
                        <img
                          src={`http://127.0.0.1:5000${product.image_url}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-2xl font-bold">
                          {product.name && product.name.charAt ? product.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="text-sm font-bold text-black mb-1 line-clamp-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {product.name}
                      </h4>
                      <p className="text-black/60 text-xs mb-3 line-clamp-1">
                        {product.description}
                      </p>

                      {renderStars(product.average_rating || 0, product.review_count || 0)}

                      <div className="flex items-center justify-between mt-3 mb-4">
                        <p className="text-black font-bold text-lg">PKR {product.price}</p>
                        <p className="text-xs text-black/50">Stock: {product.stock_quantity}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-black text-white px-3 py-2 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
                          onClick={() => handleAddToCart(product)}
                        >
                          ADD TO CART
                        </button>
                        <button
                          className="border border-black text-black px-3 py-2 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                          onClick={() => handleProductClick(product)}
                        >
                          VIEW
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white border border-black/10">
                  <p className="text-2xl font-bold text-black mb-4 tracking-widest">NO PRODUCTS FOUND</p>
                  <p className="text-gray-500">Try broadening your search or clearing filters.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-black/10 p-4 flex gap-6 hover:border-black/30 transition-colors"
                  >
                    <div
                      className="w-32 h-32 bg-gray-50 flex items-center justify-center cursor-pointer flex-shrink-0"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.image_url ? (
                        <img
                          src={`http://127.0.0.1:5000${product.image_url}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-xl font-bold">
                          {product.name && product.name.charAt ? product.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-black mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {product.name}
                      </h4>
                      <p className="text-black/60 text-sm mb-2 line-clamp-2">{product.description}</p>
                      {renderStars(product.average_rating || 0, product.review_count || 0)}
                      <div className="flex items-center gap-4 mt-3">
                        <p className="text-black font-bold text-xl">PKR {product.price}</p>
                        <p className="text-xs text-black/50">Stock: {product.stock_quantity}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <button
                        className="bg-black text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
                        onClick={() => handleAddToCart(product)}
                      >
                        ADD TO CART
                      </button>
                      <button
                        className="border border-black text-black px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                        onClick={() => handleProductClick(product)}
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white border border-black/10">
                  <p className="text-2xl font-bold text-black mb-4 tracking-widest">NO PRODUCTS FOUND</p>
                  <p className="text-gray-500">Try broadening your search or clearing filters.</p>
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-black text-black text-sm font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
              >
                PREV
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const isCurrentPage = currentPage === pageNumber;
                const isNearCurrent = Math.abs(currentPage - pageNumber) <= 2;
                const isFirstOrLast = pageNumber === 1 || pageNumber === totalPages;

                if (isFirstOrLast || isCurrentPage || isNearCurrent) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 border text-sm font-bold tracking-widest uppercase transition-colors ${
                        isCurrentPage
                          ? "bg-black text-white border-black"
                          : "border-black text-black hover:bg-black hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }

                if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                  <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                }

                return null;
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-black text-black text-sm font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
              >
                NEXT
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}