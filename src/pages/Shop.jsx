import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist, getWishlist, removeFromWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";
import ShopFilters from "../components/shop/ShopFilters";
import ShopProductCard from "../components/shop/ShopProductCard";
import ShopPagination from "../components/shop/ShopPagination";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(24);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const items = await getWishlist();
        setWishlistItems(items);
      } catch {}

      try {
        const res = await fetch(`http://127.0.0.1:5000/api/products?page=1&per_page=200`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const prods = data.products || [];
        setProducts(prods);

        if (prods.length > 0) {
          const prices = prods.map((p) => Number(p.price) || 0);
          const max = Math.min(Math.ceil(Math.max(...prices) / 10) * 10, 100000);
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const districts = useMemo(() => [...new Set(products.map((p) => p.district).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term)
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedDistrict) {
      filtered = filtered.filter((p) => p.district === selectedDistrict);
    }
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedDistrict, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDistrict, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDistrict("");
    setPriceRange([0, maxPrice]);
    setSortBy("name");
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      const inWishlist = wishlistItems.some((item) => item.id === product.id);
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product);
        const updated = await getWishlist();
        setWishlistItems(updated);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-black/5 rounded" />
            <div className="h-4 w-64 bg-black/5 rounded" />
            <div className="h-12 bg-black/5 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-black/5">
                  <div className="aspect-[4/5] bg-black/5" />
                  <div className="p-3.5 space-y-2">
                    <div className="h-3 bg-black/5 rounded w-1/3" />
                    <div className="h-4 bg-black/5 rounded w-2/3" />
                    <div className="h-3 bg-black/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black/40 text-lg mb-2">Something went wrong</p>
          <p className="text-black/25 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="bg-black py-7">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
            Shop
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-white mt-1.5">
            Our Collections
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ShopFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          districts={districts}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearAllFilters={clearAllFilters}
          resultCount={filteredProducts.length}
        />

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedProducts.map((product) => (
              <ShopProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistItems.some((item) => item.id === product.id)}
                onToggleWishlist={() => handleToggleWishlist(product)}
                onAddToCart={() => handleAddToCart(product)}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-black/30 text-lg mb-1">No products found</p>
            <p className="text-black/20 text-sm">Try adjusting your filters</p>
          </div>
        )}

        <ShopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
