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

const ProductViewsChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          className="p-4 rounded-lg shadow-lg max-w-xs"
          style={{
            backgroundColor: "#2d2d2d",
            border: "1px solid #3d3d3d",
            color: "#ffffff",
          }}
        >
          <p className="font-semibold text-sm mb-1">{label}</p>
          <p className="text-lg font-bold" style={{ color: "#d4af37" }}>
            {data.value} views
          </p>
          <p className="text-xs" style={{ color: "#cccccc" }}>
            Avg time: {data.payload.avg_time_spent || 0}s
          </p>
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
        Product Views Performance
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.slice(0, 10)}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
            <XAxis
              dataKey="product_name"
              stroke="#cccccc"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis stroke="#cccccc" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="views"
              fill="#d4af37"
              radius={[4, 4, 0, 0]}
              name="Views"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm" style={{ color: "#cccccc" }}>
          Top 10 products by view count - Hover for details
        </p>
      </div>
    </div>
  );
};

export default ProductViewsChart;
