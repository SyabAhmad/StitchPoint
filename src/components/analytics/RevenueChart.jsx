import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Mock data for demonstration - replace with real data when available
const generateMockTrendData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString(),
      views: Math.floor(Math.random() * 100) + 50,
      clicks: Math.floor(Math.random() * 50) + 20,
      cartAdds: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 500) + 100,
    });
  }
  return data;
};

const RevenueChart = ({ data }) => {
  // Use mock data if no real trend data is available
  const trendData = data && data.length > 0 ? data : generateMockTrendData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-4 rounded-lg shadow-lg"
          style={{
            backgroundColor: "#2d2d2d",
            border: "1px solid #3d3d3d",
            color: "#ffffff",
          }}
        >
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="shadow rounded-lg p-6"
      style={{ backgroundColor: "#1d1d1d" }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#d4af37" }}>
        Performance Trends
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b8860b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#b8860b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
            <XAxis
              dataKey="date"
              stroke="#cccccc"
              fontSize={10}
              tick={{ fill: "#cccccc" }}
            />
            <YAxis stroke="#cccccc" fontSize={10} tick={{ fill: "#cccccc" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#d4af37"
              fillOpacity={1}
              fill="url(#colorViews)"
              name="Views"
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#b8860b"
              fillOpacity={1}
              fill="url(#colorClicks)"
              name="Clicks"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm" style={{ color: "#cccccc" }}>
          30-day trend showing views and clicks over time
        </p>
      </div>
    </div>
  );
};

export default RevenueChart;
