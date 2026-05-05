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

const CommentTrendsChart = ({ data }) => {
  const chartData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg shadow-lg"
          style={{ backgroundColor: "#1d1d1d", border: "1px solid #4ecdc4" }}
        >
          <p className="text-xs font-bold" style={{ color: "#4ecdc4" }}>{label}</p>
          <p className="text-lg font-bold text-white">{payload[0].value} comments</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#111111", border: "1px solid #222" }}>
      <h4 className="font-semibold text-sm mb-3" style={{ color: "#4ecdc4" }}>Comments Trend</h4>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="commentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ecdc4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="date" stroke="#666" fontSize={9} tick={{ fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis stroke="#666" fontSize={9} tick={{ fill: "#888" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="comments" stroke="#4ecdc4" strokeWidth={2} fill="url(#commentGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommentTrendsChart;