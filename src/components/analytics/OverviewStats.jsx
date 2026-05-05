import React from "react";
import { FaEye, FaMousePointer, FaShoppingCart, FaClock, FaStar, FaCommentAlt, FaMoneyBillWave } from "react-icons/fa";

const OverviewStats = ({ data }) => {
  const stats = [
    { label: "Total Views", value: data.total_views || 0, icon: <FaEye />, color: "#d4af37" },
    { label: "Total Clicks", value: data.total_clicks || 0, icon: <FaMousePointer />, color: "#4ecdc4" },
    { label: "Cart Adds", value: data.total_cart_adds || 0, icon: <FaShoppingCart />, color: "#ff6b6b" },
    { label: "Avg Time", value: `${data.avg_time_spent || 0}s`, icon: <FaClock />, color: "#a78bfa" },
    { label: "Reviews", value: data.total_reviews || 0, icon: <FaStar />, color: "#fbbf24" },
    { label: "Avg Rating", value: data.avg_rating ? data.avg_rating.toFixed(1) : "0.0", icon: <FaStar />, color: "#34d399" },
    { label: "Comments", value: data.total_comments || 0, icon: <FaCommentAlt />, color: "#60a5fa" },
    { label: "Avg/Product", value: data.avg_comments_per_product?.toFixed(1) || "0.0", icon: <FaCommentAlt />, color: "#f472b6" },
  ];

  if (data.total_revenue !== undefined) {
    stats.push(
      { label: "Revenue", value: `PKR ${(data.total_revenue || 0).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "#22c55e" },
      { label: "Profit", value: `PKR ${(data.total_profit || 0).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "#d4af37" },
      { label: "Units Sold", value: data.total_units_sold || 0, icon: <FaShoppingCart />, color: "#ec4899" },
      { label: "Costs", value: `PKR ${(data.total_costs || 0).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "#6b7280" }
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-xl transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "#111111", border: `1px solid ${stat.color}40` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "#888" }}>{stat.label}</span>
            <span style={{ color: stat.color }}>{React.cloneElement(stat.icon, { size: 14 })}</span>
          </div>
          <div className="text-xl font-bold" style={{ color: stat.color }}>
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;