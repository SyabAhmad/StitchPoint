import React from "react";

const OverviewStats = ({ data }) => {
  const stats = [
    {
      label: "TOTAL VIEWS",
      value: data.total_views,
      color: "#ffffff",
    },
    {
      label: "TOTAL CLICKS",
      value: data.total_clicks,
      color: "#ffffff",
    },
    {
      label: "CART ADDS",
      value: data.total_cart_adds,
      color: "#ffffff",
    },
    {
      label: "AVG TIME SPENT",
      value: `${data.avg_time_spent}s`,
      color: "#ffffff",
    },
    {
      label: "TOTAL REVIEWS",
      value: data.total_reviews,
      color: "#ffffff",
    },
    {
      label: "AVG RATING",
      value: data.avg_rating || 0,
      color: "#ffffff",
    },
    {
      label: "TOTAL COMMENTS",
      value: data.total_comments,
      color: "#ffffff",
    },
    {
      label: "AVG COMMENTS/PRODUCT",
      value: data.avg_comments_per_product,
      color: "#ffffff",
    },
  ];

  if (data.total_revenue !== undefined) {
    stats.push(
      {
        label: "TOTAL REVENUE",
        value: `PKR ${data.total_revenue || 0}`,
        color: "#ffffff",
      },
      {
        label: "TOTAL PROFIT",
        value: `PKR ${data.total_profit || 0}`,
        color: data.total_profit >= 0 ? "#ffffff" : "#ff0000",
        icon: "📈",
      },
      {
        label: "UNITS SOLD",
        value: data.total_units_sold || 0,
        color: "#ffffff",
      },
      {
        label: "TOTAL COSTS",
        value: `PKR ${data.total_costs || 0}`,
        color: "#ffffff",
      }
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="border border-white/20 p-4"
          style={{ backgroundColor: "#111111" }}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
            {stat.value}
          </div>
          <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "#888888" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;