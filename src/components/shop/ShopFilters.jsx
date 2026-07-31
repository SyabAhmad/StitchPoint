import React, { useState } from "react";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";

export default function ShopFilters({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  districts,
  selectedDistrict,
  setSelectedDistrict,
  priceRange,
  setPriceRange,
  maxPrice,
  sortBy,
  setSortBy,
  clearAllFilters,
  resultCount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasFilters = searchTerm || selectedCategory || selectedDistrict || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:flex items-center gap-4 py-4 border-b border-black/5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 text-xs" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-black/25"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black/50">
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-black/60 appearance-none cursor-pointer min-w-[130px]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* District */}
        {districts.length > 0 && (
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-black/60 appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        )}

        {/* Price */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            className="w-20 px-2.5 py-2 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-center"
            placeholder="Min"
          />
          <span className="text-black/20 text-xs">–</span>
          <input
            type="number"
            min="0"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
            className="w-20 px-2.5 py-2 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-center"
            placeholder="Max"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-black/60 appearance-none cursor-pointer"
        >
          <option value="name">Sort: A-Z</option>
          <option value="price-low">Sort: Price ↑</option>
          <option value="price-high">Sort: Price ↓</option>
          <option value="newest">Sort: Newest</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-black/30 hover:text-gold-500 transition-colors whitespace-nowrap"
          >
            Clear all
          </button>
        )}

        {/* Count */}
        <span className="text-xs text-black/25 ml-auto whitespace-nowrap">
          {resultCount} products
        </span>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between py-4 border-b border-black/5">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm text-black/50 hover:text-gold-500 transition-colors"
        >
          <FaSlidersH className="text-xs" />
          Filters
        </button>
        <span className="text-xs text-black/25">{resultCount} products</span>
      </div>

      {/* Mobile Filter Panel */}
      {mobileOpen && (
        <div className="md:hidden pb-4 border-b border-black/5 space-y-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 text-xs" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-black/25"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-black/60"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-black/[0.03] rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold-500/30 transition-all text-black/60"
            >
              <option value="name">A-Z</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2.5 text-xs text-black/30 hover:text-gold-500 border border-black/10 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active Filter Tags */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 py-3">
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold-500/10 text-gold-600 text-xs font-medium rounded-full">
              "{searchTerm}"
              <button onClick={() => setSearchTerm("")} className="hover:text-gold-800"><FaTimes className="text-[10px]" /></button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold-500/10 text-gold-600 text-xs font-medium rounded-full">
              {selectedCategory}
              <button onClick={() => setSelectedCategory("")} className="hover:text-gold-800"><FaTimes className="text-[10px]" /></button>
            </span>
          )}
          {selectedDistrict && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold-500/10 text-gold-600 text-xs font-medium rounded-full">
              {selectedDistrict}
              <button onClick={() => setSelectedDistrict("")} className="hover:text-gold-800"><FaTimes className="text-[10px]" /></button>
            </span>
          )}
        </div>
      )}
    </>
  );
}
