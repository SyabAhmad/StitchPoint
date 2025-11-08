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
    <section className="py-20 px-6 bg-gradient-to-br from-red-500/3 to-white/97">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-red-500 text-center mb-12 tracking-wide">
          🔥 Top Sale Products
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl overflow-hidden bg-white shadow-lg border border-red-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      product.image_url || "/placeholder.jpg"
                    })`,
                  }}
                />
                {/* Sale Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    {product.sale_type} SALE
                  </span>
                </div>
                {/* Discount Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                    {product.sale_discount_percentage}% OFF
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex-1">
                  <strong className="text-lg font-semibold text-black mb-2 block">
                    {product.name}
                  </strong>
                  <div className="flex items-center gap-2">
                    <p className="text-red-500 font-bold text-lg line-through">
                      ${product.price}
                    </p>
                    <p className="text-green-600 font-bold text-xl">
                      $
                      {(
                        product.price *
                        (1 - product.sale_discount_percentage / 100)
                      ).toFixed(2)}
                    </p>
                  </div>
                  {product.store_name && (
                    <p className="text-black/50 text-xs mt-1">
                      By: {product.store_name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-black/60">
            <p className="text-lg mb-2">No sale products available.</p>
            <p className="text-sm">Check back later for amazing deals!</p>
          </div>
        )}
      </div>
    </section>
  );
}
