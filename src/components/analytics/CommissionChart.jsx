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

const CommissionChart = ({ data }) => {
  // Process commission trend data
  const processedData =
    data && data.length > 0
      ? data.map((item) => ({
          date: item.date,
          commission_earned: item.commission_earned,
          formatted_date: new Date(item.date).toLocaleDateString(),
        }))
      : [];

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
          <p className="font-semibold mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          <p style={{ color: "#4ecdc4" }}>
            Commission Earned: PKR {(payload[0]?.value || 0).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: "#2d2d2d" }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#ffffff" }}>
        Commission Earnings Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#cccccc" }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            axisLine={{ stroke: "#3d3d3d" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#cccccc" }}
            tickFormatter={(value) => `PKR ${value.toLocaleString()}`}
            axisLine={{ stroke: "#3d3d3d" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#cccccc" }} />
          <Line
            type="monotone"
            dataKey="commission_earned"
            stroke="#4ecdc4"
            strokeWidth={3}
            dot={{ fill: "#4ecdc4", strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, fill: "#4ecdc4" }}
            name="Commission Earned"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-sm" style={{ color: "#cccccc" }}>
          Daily commission earnings from all products with active commissions
        </p>
      </div>
    </div>
  );
};

export default CommissionChart;
