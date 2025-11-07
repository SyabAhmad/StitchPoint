import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data }) => {
  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#ffffff" }}>
        Sales Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#cccccc" }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            axisLine={{ stroke: "#3d3d3d" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#cccccc" }}
            axisLine={{ stroke: "#3d3d3d" }}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]}
            contentStyle={{
              backgroundColor: "#1d1d1d",
              border: "1px solid #3d3d3d",
              borderRadius: "4px",
              color: "#ffffff",
            }}
          />
          <Legend wrapperStyle={{ color: "#cccccc" }} />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#d4af37"
            strokeWidth={2}
            dot={{ fill: "#d4af37", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#d4af37" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
