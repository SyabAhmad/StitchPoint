import React from "react";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";

const TopProductsList = ({ products }) => {
  const getRankColor = (index) => {
    const colors = ["#d4af37", "#c0c0c0", "#cd7f32"];
    return colors[index] || "#666";
  };

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#111111", border: "1px solid #222" }}>
      <div className="flex items-center gap-2 mb-4">
        <FaTrophy className="text-lg" style={{ color: "#d4af37" }} />
        <h3 className="text-base font-semibold" style={{ color: "#fff" }}>Top Products</h3>
      </div>
      <div className="space-y-2">
        {products.slice(0, 5).map((product, index) => (
          <Link
            to={`/product/${product.product_id}`}
            key={product.product_id}
            className="flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.02] cursor-pointer block"
            style={{ backgroundColor: "#1a1a1a", borderLeft: `3px solid ${getRankColor(index)}` }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#252525"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1a1a1a"}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: getRankColor(index), color: "#000" }}>
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium truncate max-w-[120px]" style={{ color: "#fff" }}>{product.name}</p>
                <p className="text-xs" style={{ color: "#666" }}>ID: {product.product_id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: getRankColor(index) }}>{product.views}</p>
              <p className="text-xs" style={{ color: "#666" }}>views</p>
            </div>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center py-4" style={{ color: "#666" }}>No products available</p>
      )}
    </div>
  );
};

export default TopProductsList;