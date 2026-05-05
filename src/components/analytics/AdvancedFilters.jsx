import React, { useState } from "react";
import {
  FaFilter,
  FaTimes,
} from "react-icons/fa";

const AdvancedFilters = ({ onFiltersChange, initialFilters = {} }) => {
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

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
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
    });
    onFiltersChange({
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
    });
  };

  return (
    <div className="border border-white/10 mb-8" style={{ backgroundColor: "#111111" }}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <FaFilter className="text-white" />
          <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: "#ffffff" }}>
            FILTERS
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "#888888" }}
        >
          {isExpanded ? "HIDE" : "SHOW"}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              DATE START
            </label>
            <input
              type="date"
              value={filters.dateRange.start || ""}
              onChange={(e) =>
                handleFilterChange("dateRange", {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              DATE END
            </label>
            <input
              type="date"
              value={filters.dateRange.end || ""}
              onChange={(e) =>
                handleFilterChange("dateRange", {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              CUSTOMER
            </label>
            <select
              value={filters.customerSegment}
              onChange={(e) =>
                handleFilterChange("customerSegment", e.target.value)
              }
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            >
              <option value="all">ALL</option>
              <option value="new">NEW</option>
              <option value="returning">RETURNING</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              DEVICE
            </label>
            <select
              value={filters.device}
              onChange={(e) => handleFilterChange("device", e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            >
              <option value="all">ALL</option>
              <option value="desktop">DESKTOP</option>
              <option value="mobile">MOBILE</option>
              <option value="tablet">TABLET</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              TRAFFIC
            </label>
            <select
              value={filters.trafficSource}
              onChange={(e) => handleFilterChange("trafficSource", e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            >
              <option value="all">ALL</option>
              <option value="organic">ORGANIC</option>
              <option value="direct">DIRECT</option>
              <option value="referral">REFERRAL</option>
              <option value="social">SOCIAL</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              CATEGORY
            </label>
            <select
              value={filters.productCategory}
              onChange={(e) =>
                handleFilterChange("productCategory", e.target.value)
              }
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            >
              <option value="all">ALL</option>
              <option value="clothing">CLOTHING</option>
              <option value="accessories">ACCESSORIES</option>
              <option value="shoes">SHOES</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              MIN PRICE
            </label>
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) =>
                handleFilterChange("priceRange", {
                  ...filters.priceRange,
                  min: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              MAX PRICE
            </label>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) =>
                handleFilterChange("priceRange", {
                  ...filters.priceRange,
                  max: parseInt(e.target.value) || 1000,
                })
              }
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              RATING
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            >
              <option value="all">ALL</option>
              <option value="5">5 STAR</option>
              <option value="4">4 STAR</option>
              <option value="3">3 STAR</option>
              <option value="2">2 STAR</option>
              <option value="1">1 STAR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              STATUS
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            >
              <option value="all">ALL</option>
              <option value="active">ACTIVE</option>
              <option value="inactive">INACTIVE</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#888888" }}>
              SEARCH
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 bg-black border border-white/20 text-white text-sm"
            />
          </div>

          <div className="col-span-2 md:col-span-4 flex items-center gap-4 mt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-white/20 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
              style={{ color: "#ffffff" }}
            >
              RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;