import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/products/new-arrivals"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setProducts([]);
      }
    };

    fetchNewArrivals();
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
    <section className="py-20 px-6 bg-gradient-to-br from-gold-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gold-500 text-center mb-12 tracking-wide">
          New Arrivals
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => handleProductClick(product)}
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
                  <div className="flex items-center gap-2 mb-1">
                    {product.sale_type && product.sale_discount_percentage && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {product.sale_type} SALE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {product.sale_type && product.sale_discount_percentage ? (
                      <>
                        <p className="text-red-500 font-bold text-lg line-through">
                          PKR{product.price}
                        </p>
                        <p className="text-green-600 font-bold text-lg">
                          PKR
                          {(
                            product.price *
                            (1 - product.sale_discount_percentage / 100)
                          ).toFixed(2)}
                        </p>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                          {product.sale_discount_percentage}% OFF
                        </span>
                      </>
                    ) : (
                      <p className="text-gold-500 font-bold text-lg">
                        PKR-{product.price}
                      </p>
                    )}
                  </div>
                  {product.store_name && (
                    <p className="text-black/50 text-xs">
                      By: {product.store_name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-black/60">
            <p className="text-lg mb-2">No new arrivals available.</p>
            <p className="text-sm">Please check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </section>
  );
}
