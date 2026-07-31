import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaChartBar,
  FaFilter,
  FaTimes,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaCheckCircle,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

const AdvancedFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: initialFilters.dateRange || { start: null, end: null },
    customerSegment: initialFilters.customerSegment || "all",
    location: initialFilters.location || { country: "", city: "" },
    device: initialFilters.device || "all",
    trafficSource: initialFilters.trafficSource || "all",
    productCategory: initialFilters.productCategory || "all",
    priceRange: initialFilters.priceRange || { min: 0, max: 1000 },
    rating: initialFilters.rating || "all",
    status: initialFilters.status || "all",
    search: initialFilters.search || "",
    active: initialFilters.active || false,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    const defaults = {
      dateRange: { start: null, end: null },
      customerSegment: "all",
      location: { country: "", city: "" },
      device: "all",
      trafficSource: "all",
      productCategory: "all",
      priceRange: { min: 0, max: 1000 },
      rating: "all",
      status: "all",
      search: "",
      active: false,
    };
    setFilters(defaults);
    onFiltersChange(defaults);
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all";
  const selectClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40 transition-all appearance-none cursor-pointer";
  const labelClass = "flex items-center gap-2 text-[11px] text-white/35 uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-[#111] border border-white/5 rounded-lg mb-6">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <FaFilter className="text-gold-500 text-xs" />
          <span className="text-sm font-medium text-white/70">Advanced Filters</span>
        </div>
        <FaChevronDown className={`text-white/30 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Filters Grid */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="sm:col-span-2">
              <label className={labelClass}><FaCalendarAlt className="text-gold-500/50" /> Date Range</label>
              <div className="flex gap-2">
                <input type="date" value={filters.dateRange.start || ""} onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, start: e.target.value })} className={inputClass} />
                <input type="date" value={filters.dateRange.end || ""} onChange={(e) => handleFilterChange("dateRange", { ...filters.dateRange, end: e.target.value })} className={inputClass} />
              </div>
            </div>

            {/* Customer Segment */}
            <div>
              <label className={labelClass}><FaUsers className="text-gold-500/50" /> Customer Segment</label>
              <select value={filters.customerSegment} onChange={(e) => handleFilterChange("customerSegment", e.target.value)} className={selectClass}>
                <option value="all" className="bg-black">All Customers</option>
                <option value="new" className="bg-black">New</option>
                <option value="returning" className="bg-black">Returning</option>
                <option value="loyal" className="bg-black">Loyal</option>
                <option value="high_value" className="bg-black">High Value</option>
              </select>
            </div>

            {/* Device */}
            <div>
              <label className={labelClass}><FaMobileAlt className="text-gold-500/50" /> Device</label>
              <select value={filters.device} onChange={(e) => handleFilterChange("device", e.target.value)} className={selectClass}>
                <option value="all" className="bg-black">All Devices</option>
                <option value="desktop" className="bg-black">Desktop</option>
                <option value="mobile" className="bg-black">Mobile</option>
                <option value="tablet" className="bg-black">Tablet</option>
              </select>
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className={labelClass}><FaMapMarkerAlt className="text-gold-500/50" /> Location</label>
              <div className="flex gap-2">
                <input type="text" value={filters.location.country} onChange={(e) => handleFilterChange("location", { ...filters.location, country: e.target.value })} placeholder="Country" className={inputClass} />
                <input type="text" value={filters.location.city} onChange={(e) => handleFilterChange("location", { ...filters.location, city: e.target.value })} placeholder="City" className={inputClass} />
              </div>
            </div>

            {/* Traffic Source */}
            <div>
              <label className={labelClass}><FaChartBar className="text-gold-500/50" /> Traffic Source</label>
              <select value={filters.trafficSource} onChange={(e) => handleFilterChange("trafficSource", e.target.value)} className={selectClass}>
                <option value="all" className="bg-black">All Sources</option>
                <option value="organic" className="bg-black">Organic</option>
                <option value="direct" className="bg-black">Direct</option>
                <option value="referral" className="bg-black">Referral</option>
                <option value="social" className="bg-black">Social</option>
                <option value="email" className="bg-black">Email</option>
                <option value="paid" className="bg-black">Paid Ads</option>
              </select>
            </div>

            {/* Product Category */}
            <div>
              <label className={labelClass}><FaFilter className="text-gold-500/50" /> Category</label>
              <select value={filters.productCategory} onChange={(e) => handleFilterChange("productCategory", e.target.value)} className={selectClass}>
                <option value="all" className="bg-black">All Categories</option>
                <option value="clothing" className="bg-black">Clothing</option>
                <option value="accessories" className="bg-black">Accessories</option>
                <option value="shoes" className="bg-black">Shoes</option>
                <option value="jewelry" className="bg-black">Jewelry</option>
                <option value="bags" className="bg-black">Bags</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className={labelClass}><FaDollarSign className="text-gold-500/50" /> Price Range</label>
              <div className="flex items-center gap-2">
                <input type="number" value={filters.priceRange.min} onChange={(e) => handleFilterChange("priceRange", { ...filters.priceRange, min: parseInt(e.target.value) || 0 })} placeholder="Min" className={inputClass} />
                <span className="text-white/20 text-xs">–</span>
                <input type="number" value={filters.priceRange.max} onChange={(e) => handleFilterChange("priceRange", { ...filters.priceRange, max: parseInt(e.target.value) || 1000 })} placeholder="Max" className={inputClass} />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className={labelClass}><FaStar className="text-gold-500/50" /> Rating</label>
              <select value={filters.rating} onChange={(e) => handleFilterChange("rating", e.target.value)} className={selectClass}>
                <option value="all" className="bg-black">All Ratings</option>
                <option value="5" className="bg-black">5 Stars</option>
                <option value="4" className="bg-black">4+ Stars</option>
                <option value="3" className="bg-black">3+ Stars</option>
                <option value="2" className="bg-black">2+ Stars</option>
                <option value="1" className="bg-black">1+ Star</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}><FaCheckCircle className="text-gold-500/50" /> Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} className={selectClass}>
                <option value="all" className="bg-black">All Status</option>
                <option value="active" className="bg-black">Active</option>
                <option value="inactive" className="bg-black">Inactive</option>
                <option value="pending" className="bg-black">Pending</option>
                <option value="delivered" className="bg-black">Delivered</option>
                <option value="cancelled" className="bg-black">Cancelled</option>
              </select>
            </div>

            {/* Search */}
            <div className="sm:col-span-2">
              <label className={labelClass}><FaSearch className="text-gold-500/50" /> Search</label>
              <input type="text" value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} placeholder="Search products, customers, orders..." className={inputClass} />
            </div>

            {/* Active Toggle */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filters.active} onChange={(e) => handleFilterChange("active", e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/40" />
                <span className="text-xs text-white/40">Active only</span>
              </label>
            </div>
          </div>

          {/* Reset */}
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <button onClick={resetFilters} className="text-xs text-white/30 hover:text-gold-500 transition-colors flex items-center gap-1.5">
              <FaTimes className="text-[10px]" /> Reset all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
