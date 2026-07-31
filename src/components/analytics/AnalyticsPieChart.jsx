import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#D4AF37", "#B8860B", "#DAA520"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="font-semibold text-sm text-white">{d.name}: {d.value}</p>
        <p className="text-xs text-white/40 mt-0.5">
          {d.name === "Views" ? "Product page views" : d.name === "Clicks" ? "Product interactions" : "Items added to cart"}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPieChart = ({ data }) => {
  const pieData = [
    { name: "Views", value: data.total_views },
    { name: "Clicks", value: data.total_clicks },
    { name: "Cart Adds", value: data.total_cart_adds },
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={renderLabel} outerRadius={90} dataKey="value">
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsPieChart;
