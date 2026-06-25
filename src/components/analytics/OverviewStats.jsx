import React from "react";
import { FaEye, FaMousePointer, FaShoppingCart, FaClock, FaStar, FaCommentAlt, FaMoneyBillWave } from "react-icons/fa";

const OverviewStats = ({ data }) => {
  const normalizeNumber = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || 0;
    return 0;
  };

  const stats = [
    { label: "Total Views", value: normalizeNumber(data.total_views), icon: <FaEye />, color: "#d4af37" },
    { label: "Total Clicks", value: normalizeNumber(data.total_clicks), icon: <FaMousePointer />, color: "#4ecdc4" },
    { label: "Cart Adds", value: normalizeNumber(data.total_cart_adds), icon: <FaShoppingCart />, color: "#ff6b6b" },
    { label: "Avg Time", value: `${normalizeNumber(data.avg_time_spent)}s`, icon: <FaClock />, color: "#a78bfa" },
    { label: "Reviews", value: normalizeNumber(data.total_reviews), icon: <FaStar />, color: "#fbbf24" },
    { label: "Avg Rating", value: normalizeNumber(data.avg_rating).toFixed(1), icon: <FaStar />, color: "#34d399" },
    { label: "Comments", value: normalizeNumber(data.total_comments), icon: <FaCommentAlt />, color: "#60a5fa" },
    { label: "Avg/Product", value: normalizeNumber(data.avg_comments_per_product).toFixed(1), icon: <FaCommentAlt />, color: "#f472b6" },
  ];

  if (data.total_revenue !== undefined) {
    stats.push(
      { label: "Revenue", value: `PKR ${normalizeNumber(data.total_revenue).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "#22c55e" },
      { label: "Profit", value: `PKR ${normalizeNumber(data.total_profit).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "#d4af37" },
      { label: "Units Sold", value: normalizeNumber(data.total_units_sold), icon: <FaShoppingCart />, color: "#ec4899" },
      { label: "Costs", value: `PKR ${normalizeNumber(data.total_costs).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "#6b7280" }
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