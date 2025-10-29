import React, { useState, useEffect } from "react";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Get the latest 3 products
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gold-500/2 to-white/98">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-gold-500 text-center mb-8">
          New Arrivals
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
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
                  <p className="text-gold-500 font-bold text-lg mb-1">
                    ${product.price}
                  </p>
                  {product.store_name && (
                    <p className="text-black/50 text-xs">
                      By: {product.store_name}
                    </p>
                  )}
                </div>
                <button className="bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-black/60">
            <p className="text-lg mb-2">No new arrivals available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
