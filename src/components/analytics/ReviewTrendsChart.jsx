import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="font-semibold text-sm text-white mb-1">{new Date(label).toLocaleDateString()}</p>
        <p className="text-lg font-bold text-gold-500">{payload[0].value} reviews</p>
      </div>
    );
  }
  return null;
};

const ReviewTrendsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString()} />
        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="reviews" stroke="#D4AF37" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#D4AF37", strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReviewTrendsChart;
