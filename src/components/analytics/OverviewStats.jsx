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
  ];

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
