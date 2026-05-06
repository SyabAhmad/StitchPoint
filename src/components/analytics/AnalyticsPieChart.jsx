import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AnalyticsPieChart = ({ data }) => {
  const total = (data.total_views || 0) + (data.total_clicks || 0) + (data.total_cart_adds || 0);
  
  const pieData = [
    { name: "Views", value: data.total_views || 0, color: "#d4af37" },
    { name: "Clicks", value: data.total_clicks || 0, color: "#4ecdc4" },
    { name: "Cart Adds", value: data.total_cart_adds || 0, color: "#ff6b6b" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const val = item?.value || 0;
      const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
      return (
        <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: "#1d1d1d", border: `1px solid ${item.color}` }}>
          <p className="text-sm font-bold" style={{ color: item.color }}>{item.name}</p>
          <p className="text-lg font-bold text-white">{val.toLocaleString()}</p>
          <p className="text-xs" style={{ color: "#666" }}>{pct}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#111111", border: "1px solid #222" }}>
      <h3 className="text-base font-semibold mb-3" style={{ color: "#fff" }}>Interactions</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {pieData.map((item, index) => (
          <div key={index} className="text-center p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
            <p className="text-sm font-bold" style={{ color: item.color }}>{item.value.toLocaleString()}</p>
            <p className="text-xs" style={{ color: "#666" }}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPieChart;