import React, { useState, useEffect } from "react";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";

export default function CardsSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Get the first 3 products for featured showcase
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
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

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-black-silk/5 to-white/95">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gold-500 mb-6 tracking-wide">
          Featured Products
        </h2>
        <p className="text-xl md:text-2xl text-black/80 max-w-3xl mx-auto leading-relaxed font-light">
          Discover our handpicked selection of premium fashion pieces, crafted
          with elegance and precision
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <article
              key={product.id}
              className="relative overflow-hidden rounded-2xl min-h-[450px] flex flex-col bg-white shadow-lg border border-gold-500/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div
                className="flex-1 bg-cover bg-center min-h-[380px]"
                style={{
                  backgroundImage: `url(${
                    product.image_url || "/placeholder.jpg"
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute left-0 right-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gold-400 font-bold text-lg mb-1">
                      ${product.price}
                    </p>
                    {product.store_name && (
                      <p className="text-white/70 text-sm">
                        By: {product.store_name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex-1"
                    >
                      Add to Cart
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-black/60">
            <p className="text-lg mb-2">No featured products available.</p>
            <p className="text-sm">Please check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </section>
  );
}
