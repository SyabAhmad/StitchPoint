import React from "react";

const OverviewStats = ({ data }) => {
  const stats = [
    {
      label: "Total Views",
      value: data.total_views,
      color: "#d4af37",
      icon: "👁️",
    },
    {
      label: "Total Clicks",
      value: data.total_clicks,
      color: "#b8860b",
      icon: "🖱️",
    },
    {
      label: "Cart Adds",
      value: data.total_cart_adds,
      color: "#daa520",
      icon: "🛒",
    },
    {
      label: "Avg Time Spent",
      value: `${data.avg_time_spent}s`,
      color: "#f4e4bc",
      icon: "⏱️",
    },
    {
      label: "Total Reviews",
      value: data.total_reviews,
      color: "#ffd700",
      icon: "⭐",
    },
    {
      label: "Avg Rating",
      value: data.avg_rating || 0,
      color: "#ffb347",
      icon: "📊",
    },
    {
      label: "Total Comments",
      value: data.total_comments,
      color: "#ff8c00",
      icon: "💬",
    },
    {
      label: "Avg Comments/Product",
      value: data.avg_comments_per_product,
      color: "#ff6347",
      icon: "📝",
    },
  ];

  // Add financial metrics if available
  if (data.total_revenue !== undefined) {
    stats.push(
      {
        label: "Total Revenue",
        value: `PKR ${data.total_revenue || 0}`,
        color: "#4ecdc4",
        icon: "💰",
      },
      {
        label: "Total Profit",
        value: `PKR ${data.total_profit || 0}`,
        color: data.total_profit >= 0 ? "#4ecdc4" : "#ff6b6b",
        icon: "📈",
      },
      {
        label: "Total Units Sold",
        value: data.total_units_sold || 0,
        color: "#45b7d1",
        icon: "📦",
      },
      {
        label: "Total Costs",
        value: `PKR ${data.total_costs || 0}`,
        color: "#ff6b6b",
        icon: "💸",
      }
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="shadow rounded-lg p-6 transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                {stat.label}
              </div>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
