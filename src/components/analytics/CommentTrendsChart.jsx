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

const CommentTrendsChart = ({ data }) => {
  return (
    <div
      className="shadow rounded-lg p-6"
      style={{ backgroundColor: "#1d1d1d", color: "#ffffff" }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#d4af37" }}>
        Comment Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            stroke="#cccccc"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis stroke="#cccccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2d2d2d",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#ffffff",
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#ff8c00"
            strokeWidth={2}
            dot={{ fill: "#ff8c00", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommentTrendsChart;
