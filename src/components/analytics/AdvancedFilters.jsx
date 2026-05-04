import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaChartBar,
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
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
        <button
          onClick={resetFilters}
          className="px-3 py-1 bg-yellow-500 text-black rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaCalendarAlt className="inline mr-2" />
          Date Range
        </label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={filters.dateRange.start || ""}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                start: e.target.value,
              })
            }
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.dateRange.end || ""}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                end: e.target.value,
              })
            }
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Customer Segment Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaUsers className="inline mr-2" />
          Customer Segment
        </label>
        <select
          value={filters.customerSegment}
          onChange={(e) =>
            handleFilterChange("customerSegment", e.target.value)
          }
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Customers</option>
          <option value="new">New Customers</option>
          <option value="returning">Returning Customers</option>
          <option value="loyal">Loyal Customers</option>
          <option value="high_value">High Value Customers</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaMapMarkerAlt className="inline mr-2" />
          Location
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={filters.location.country}
            onChange={(e) =>
              handleFilterChange("location", {
                ...filters.location,
                country: e.target.value,
              })
            }
            placeholder="Country"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
          <input
            type="text"
            value={filters.location.city}
            onChange={(e) =>
              handleFilterChange("location", {
                ...filters.location,
                city: e.target.value,
              })
            }
            placeholder="City"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Device Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaMobileAlt className="inline mr-2" />
          Device
        </label>
        <select
          value={filters.device}
          onChange={(e) => handleFilterChange("device", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
      </div>

      {/* Traffic Source Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaChartBar className="inline mr-2" />
          Traffic Source
        </label>
        <select
          value={filters.trafficSource}
          onChange={(e) => handleFilterChange("trafficSource", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Sources</option>
          <option value="organic">Organic Search</option>
          <option value="direct">Direct</option>
          <option value="referral">Referral</option>
          <option value="social">Social Media</option>
          <option value="email">Email</option>
          <option value="paid">Paid Ads</option>
        </select>
      </div>

      {/* Product Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaFilter className="inline mr-2" />
          Product Category
        </label>
        <select
          value={filters.productCategory}
          onChange={(e) =>
            handleFilterChange("productCategory", e.target.value)
          }
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="shoes">Shoes</option>
          <option value="jewelry">Jewelry</option>
          <option value="bags">Bags</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaDollarSign className="inline mr-2" />
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={filters.priceRange.min}
            onChange={(e) =>
              handleFilterChange("priceRange", {
                ...filters.priceRange,
                min: parseInt(e.target.value) || 0,
              })
            }
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
            placeholder="Min"
          />
          <span className="text-gray-400">to</span>
          <input
            type="number"
            value={filters.priceRange.max}
            onChange={(e) =>
              handleFilterChange("priceRange", {
                ...filters.priceRange,
                max: parseInt(e.target.value) || 1000,
              })
            }
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaStar className="inline mr-2" />
          Rating
        </label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaCheckCircle className="inline mr-2" />
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          <FaSearch className="inline mr-2" />
          Search
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          placeholder="Search products, customers, orders..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      {/* Active Filter Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={filters.active}
          onChange={(e) => handleFilterChange("active", e.target.checked)}
          className="mr-2"
        />
        <label className="text-sm text-gray-400">Show only active items</label>
      </div>
    </div>
  );
};

export default AdvancedFilters;
