import React from "react";

const OverviewStats = ({ data }) => {
  const stats = [
    { label: "Total Views", value: data.total_views, icon: "👁️" },
    { label: "Total Clicks", value: data.total_clicks, icon: "🖱️" },
    { label: "Cart Adds", value: data.total_cart_adds, icon: "🛒" },
    { label: "Avg Time", value: `${data.avg_time_spent}s`, icon: "⏱️" },
    { label: "Reviews", value: data.total_reviews, icon: "⭐" },
    { label: "Avg Rating", value: data.avg_rating || 0, icon: "📊" },
    { label: "Comments", value: data.total_comments, icon: "💬" },
    { label: "Avg Comments/Product", value: data.avg_comments_per_product, icon: "📝" },
  ];

  if (data.total_revenue !== undefined) {
    stats.push(
      { label: "Revenue", value: `PKR ${(data.total_revenue || 0).toLocaleString()}`, icon: "💰" },
      { label: "Profit", value: `PKR ${(data.total_profit || 0).toLocaleString()}`, icon: "📈" },
      { label: "Units Sold", value: data.total_units_sold || 0, icon: "📦" },
      { label: "Costs", value: `PKR ${(data.total_costs || 0).toLocaleString()}`, icon: "💸" }
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#111] border border-white/5 rounded-lg p-4 hover:border-gold-500/20 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">{stat.icon}</span>
          </div>
          <p className="text-lg font-bold text-white">{stat.value}</p>
          <p className="text-[11px] text-white/30 uppercase tracking-wider mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
