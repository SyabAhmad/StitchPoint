import React from "react";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

const TopProductsList = ({ products }) => {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-500" />;
      case 1:
        return <FaMedal className="text-gray-400" />;
      case 2:
        return <FaAward className="text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-gray-500">{index + 1}</span>
        );
    }
  };

  return (
    <div
      className="shadow rounded-lg p-6"
      style={{ backgroundColor: "#1d1d1d" }}
    >
      <h3
        className="text-lg font-semibold mb-4 flex items-center"
        style={{ color: "#d4af37" }}
      >
        <FaTrophy className="mr-2" />
        Top Products by Views
      </h3>
      <div className="space-y-3">
        {products.slice(0, 5).map((product, index) => (
          <div
            key={product.product_id}
            className="flex items-center justify-between p-4 rounded-lg transition-all hover:scale-105"
            style={{
              backgroundColor: index < 3 ? "#2d2d2d" : "#1f1f1f",
              border: index < 3 ? "1px solid #d4af37" : "none",
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getRankIcon(index)}</div>
              <div>
                <p
                  className="font-medium truncate max-w-xs"
                  style={{ color: "#ffffff" }}
                >
                  {product.name}
                </p>
                <p className="text-sm" style={{ color: "#cccccc" }}>
                  Product ID: {product.product_id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style={{ color: "#d4af37" }}>
                {product.views}
              </p>
              <p className="text-xs" style={{ color: "#cccccc" }}>
                views
              </p>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: "#cccccc" }}>No product views data available</p>
        </div>
      )}
    </div>
  );
};

export default TopProductsList;
