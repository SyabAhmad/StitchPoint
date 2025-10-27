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
      <div className="min-h-screen">
        <div className="py-16 px-4 text-center bg-gradient-to-br from-gold-500/2 to-white/98">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gold-500 mb-4">
            Collections
          </h1>
          <p className="text-lg md:text-xl text-black/70">
            Loading our exquisite pieces...
          </p>
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
      {/* Title Section */}
      <div className="py-16 px-4 text-center bg-gradient-to-br from-gold-500/2 to-white/98">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gold-500 mb-4">
          Our Collections
        </h1>
        <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
          Discover timeless elegance in our curated selection of couture pieces,
          crafted with passion and precision.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex gap-8 px-4 py-8 max-w-7xl mx-auto">
        {/* Filters Sidebar */}
        <aside className="w-80 bg-white rounded-2xl shadow-lg border border-gold-500/10 p-6 h-fit sticky top-8">
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-gold-500">
              Filters
            </h3>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-black/80 text-sm">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-black/80 text-sm">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gold-500/30 rounded-lg bg-white cursor-pointer focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
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
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-black/80 text-sm">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="flex-1 px-2 py-2 border border-gold-500/30 rounded-lg text-center focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                placeholder="Min"
              />
              <span className="text-gold-500 font-semibold">-</span>
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
                className="flex-1 px-2 py-2 border border-gold-500/30 rounded-lg text-center focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                placeholder="Max"
              />
            </div>
            <div className="mt-2 text-sm text-black/60 text-center">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            className="w-full py-2 bg-gray-200 text-black/80 border border-gold-500/30 rounded-lg font-semibold hover:bg-gold-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg"
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
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <p className="text-black/70">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-black/80 text-sm">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gold-500/30 rounded-lg bg-white cursor-pointer focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div
                    className="h-64 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        product.image_url || "/placeholder.jpg"
                      })`,
                    }}
                  />
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex-1">
                      <strong className="text-lg font-semibold text-black mb-2 block">
                        {product.name}
                      </strong>
                      <p className="text-black/70 mb-2 leading-relaxed text-sm">
                        {product.description}
                      </p>
                      <p className="text-gold-500 font-bold text-lg mb-1">
                        ${product.price}
                      </p>
                      <p className="text-black/60 text-sm">
                        Stock: {product.stock_quantity}
                      </p>
                    </div>
                    <button className="w-full bg-gold-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-black/60">
                <p className="text-lg mb-2">
                  No products found matching your criteria.
                </p>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
