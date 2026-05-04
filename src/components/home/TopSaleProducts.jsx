import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";

export default function TopSaleProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopSaleProducts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/products/top-sales"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch top sale products");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching top sale products:", err);
        setProducts([]);
      }
    };

    fetchTopSaleProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleProductClick = (product) => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-12 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
          TOP SALES
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-black/5 border border-black/10 hover:border-black/30 transition-all duration-300 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div
                  className="h-64 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{
                    backgroundImage: `url(${
                      product.image_url || "/placeholder.jpg"
                    })`,
                  }}
                />
                {/* Sale Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black text-white text-xs px-3 py-1 font-bold tracking-wide">
                    SALE
                  </span>
                </div>
                {/* Discount Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white text-black text-sm px-3 py-1 font-bold">
                    {product.sale_discount_percentage}% OFF
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex-1">
                  <strong className="text-lg font-bold text-black mb-2 block tracking-wide">
                    {product.name.toUpperCase()}
                  </strong>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 font-bold text-lg line-through">
                      PKR{product.price}
                    </p>
                    <p className="text-black font-bold text-xl">
                      PKR
                      {(
                        product.price *
                        (1 - product.sale_discount_percentage / 100)
                      ).toFixed(2)}
                    </p>
                  </div>
                  {product.store_name && (
                    <p className="text-gray-500 text-xs tracking-wider mt-1">
                      BY: {product.store_name.toUpperCase()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-3 bg-black text-white font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No sale products available.</p>
            <p className="text-sm">Check back later for amazing deals!</p>
          </div>
        )}
      </div>
    </section>
  );
}
