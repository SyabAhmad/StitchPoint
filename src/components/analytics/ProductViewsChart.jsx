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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="font-semibold text-sm text-white mb-1">{label}</p>
        <p className="text-lg font-bold text-gold-500">{d.value} views</p>
        <p className="text-xs text-white/40">Avg time: {d.payload.avg_time_spent || 0}s</p>
      </div>
    );
  }
  return null;
};

const ProductViewsChart = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 10)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="product_name"
            stroke="rgba(255,255,255,0.2)"
            fontSize={11}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
          />
          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,175,55,0.05)" }} />
          <Bar dataKey="views" fill="#D4AF37" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductViewsChart;
