import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProductViewsChart = ({ data }) => {
  const chartData = data?.slice(0, 10) || [];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: "#1d1d1d", border: "1px solid #d4af37" }}>
          <p className="text-xs font-bold" style={{ color: "#d4af37" }}>{label}</p>
          <p className="text-lg font-bold text-white">{payload[0].value} views</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #222" }}>
      <h3 className="text-base font-semibold mb-4" style={{ color: "#d4af37" }}>Product Views</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity={1} />
                <stop offset="100%" stopColor="#a07c20" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="product_name" stroke="#666" fontSize={10} angle={-45} textAnchor="end" height={65} interval={0} tick={{ fill: "#888" }} />
            <YAxis stroke="#666" fontSize={10} tick={{ fill: "#888" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="views" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductViewsChart;