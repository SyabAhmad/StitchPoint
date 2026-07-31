import React from "react";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

const TopProductsList = ({ products }) => {
  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-gold-500" />;
    if (index === 1) return <FaMedal className="text-white/50" />;
    if (index === 2) return <FaAward className="text-gold-600" />;
    return <span className="text-sm font-bold text-white/20 w-5 text-center">{index + 1}</span>;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-white/20">No product data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.slice(0, 5).map((product, i) => (
        <div
          key={product.product_id}
          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/[0.03] ${
            i < 3 ? "bg-white/[0.03] border border-gold-500/10" : ""
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-6 flex justify-center">{getRankIcon(i)}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{product.name}</p>
              <p className="text-[11px] text-white/20">ID: {product.product_id}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-base font-bold text-gold-500">{product.views}</p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider">views</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProductsList;
