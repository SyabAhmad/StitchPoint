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

const ProductClicksChart = ({ data }) => {
  const chartData = data?.slice(0, 10) || [];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: "#1d1d1d", border: "1px solid #4ecdc4" }}>
          <p className="text-xs font-bold" style={{ color: "#4ecdc4" }}>{label}</p>
          <p className="text-lg font-bold text-white">{payload[0].value} clicks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #222" }}>
      <h3 className="text-base font-semibold mb-4" style={{ color: "#4ecdc4" }}>Product Clicks</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
            <defs>
              <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ecdc4" stopOpacity={1} />
                <stop offset="100%" stopColor="#2e9c99" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="product_name" stroke="#666" fontSize={10} angle={-45} textAnchor="end" height={65} interval={0} tick={{ fill: "#888" }} />
            <YAxis stroke="#666" fontSize={10} tick={{ fill: "#888" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="clicks" fill="url(#clickGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductClicksChart;