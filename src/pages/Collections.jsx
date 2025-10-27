import React, { useState, useEffect } from "react";

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
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
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

  if (loading) {
    return (
      <div className="collections-page">
        <div className="collections-title-section">
          <h1 className="collections-title">Collections</h1>
          <p className="collections-subtitle">
            Loading our exquisite pieces...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collections-page">
        <div className="collections-title-section">
          <h1 className="collections-title">Collections</h1>
          <p className="collections-subtitle">
            Error loading collections: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-page">
      {/* Title Section */}
      <div className="collections-title-section">
        <h1 className="collections-title">Our Collections</h1>
        <p className="collections-subtitle">
          Discover timeless elegance in our curated selection of couture pieces,
          crafted with passion and precision.
        </p>
      </div>

      {/* Main Layout */}
      <div className="collections-layout">
        {/* Filters Sidebar */}
        <aside className="collections-filters">
          <div className="filters-header">
            <h3>Filters</h3>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search-input"
            />
          </div>

          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="price-input"
                placeholder="Min"
              />
              <span className="price-separator">-</span>
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
                className="price-input"
                placeholder="Max"
              />
            </div>
            <div className="price-display">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setPriceRange([0, 1000]);
            }}
          >
            Clear All Filters
          </button>
        </aside>

        {/* Products Main */}
        <main className="collections-main">
          <div className="products-header">
            <p className="products-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
            <div className="sort-group">
              <label className="sort-label">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="arrivals-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="arrival-card">
                  <div
                    className="arrival-image"
                    style={{
                      backgroundImage: `url(${
                        product.image_url || "/placeholder.jpg"
                      })`,
                    }}
                  />
                  <div className="arrival-info">
                    <div className="product-details">
                      <strong className="product-name">{product.name}</strong>
                      <p className="product-description">
                        {product.description}
                      </p>
                      <p className="product-price">${product.price}</p>
                      <p className="product-stock">
                        Stock: {product.stock_quantity}
                      </p>
                    </div>
                    <button className="btn-gold product-btn">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
