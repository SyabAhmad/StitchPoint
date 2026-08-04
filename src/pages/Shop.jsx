import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import { addToWishlist, getWishlist, removeFromWishlist } from "../utils/wishlistUtils";
import toast from "react-hot-toast";
import ShopFilters from "../components/shop/ShopFilters";
import ShopProductCard from "../components/shop/ShopProductCard";
import ShopPagination from "../components/shop/ShopPagination";

const PER_PAGE = 24;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const debouncedPriceRange = useDebounce(priceRange, 400);
  const requestIdRef = useRef(0);
  const priceTouched = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const items = await getWishlist();
        setWishlistItems(items);
      } catch {}
    };
    init();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const requestId = ++requestIdRef.current;
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          per_page: String(PER_PAGE),
          sort_by: sortBy,
        });
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedDistrict) params.set("district", selectedDistrict);
        if (priceRange[0] > 0) params.set("min_price", String(priceRange[0]));
        if (priceRange[1] < maxPrice) params.set("max_price", String(priceRange[1]));

        const res = await fetch(`http://127.0.0.1:5000/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (requestId !== requestIdRef.current) return;
        setProducts(data.products || []);
        setTotal(data.total || 0);
        if (data.categories?.length) setCategories(data.categories);
        if (data.districts?.length) setDistricts(data.districts);
        if (data.max_price) {
          setMaxPrice(data.max_price);
          if (
            !priceTouched.current &&
            (priceRange[0] !== 0 || priceRange[1] !== data.max_price)
          ) {
            setPriceRange([0, data.max_price]);
          }
        }
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err.message);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, selectedDistrict, debouncedPriceRange, sortBy, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedDistrict, debouncedPriceRange, sortBy]);

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

  const totalPages = Math.ceil(total / PER_PAGE);

  if (loading && products.length === 0) {
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

  if (error && products.length === 0) {
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
    <div className="min-h-screen bg-white">
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
          setPriceRange={(range) => {
            priceTouched.current = true;
            setPriceRange(range);
          }}
          maxPrice={maxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearAllFilters={clearAllFilters}
          resultCount={total}
        />

        {/* Product Grid */}
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-black/5">
                <div className="aspect-[3/4] bg-black/5" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 bg-black/5 rounded w-1/3" />
                  <div className="h-4 bg-black/5 rounded w-2/3" />
                  <div className="h-3 bg-black/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
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

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setDebouncedValue(value);
      return;
    }
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return debouncedValue;
}
