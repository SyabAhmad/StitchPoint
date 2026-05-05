import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const ReviewTrendsChart = ({ data }) => {
  const chartData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg shadow-lg"
          style={{ backgroundColor: "#1d1d1d", border: "1px solid #d4af37" }}
        >
          <p className="text-xs font-bold" style={{ color: "#d4af37" }}>{label}</p>
          <p className="text-lg font-bold text-white">{payload[0].value} reviews</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#111111", border: "1px solid #222" }}>
      <h4 className="font-semibold text-sm mb-3" style={{ color: "#d4af37" }}>Reviews Trend</h4>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="date" stroke="#666" fontSize={9} tick={{ fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis stroke="#666" fontSize={9} tick={{ fill: "#888" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="#d4af37" strokeWidth={2} fill="url(#reviewGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReviewTrendsChart;