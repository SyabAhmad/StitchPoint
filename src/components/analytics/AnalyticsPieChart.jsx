import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const AnalyticsPieChart = ({ data }) => {
  const pieData = [
    {
      name: "Views",
      value: data.total_views,
      color: "#d4af37",
    },
    {
      name: "Clicks",
      value: data.total_clicks,
      color: "#b8860b",
    },
    {
      name: "Cart Adds",
      value: data.total_cart_adds,
      color: "#daa520",
    },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          className="p-3 rounded shadow-lg"
          style={{
            backgroundColor: "#2d2d2d",
            border: "1px solid #3d3d3d",
            color: "#ffffff",
          }}
        >
          <p className="font-semibold">{`${data.name}: ${data.value}`}</p>
          <p className="text-sm" style={{ color: "#cccccc" }}>
            {data.name === "Views"
              ? "Product page views"
              : data.name === "Clicks"
              ? "Product interactions"
              : "Items added to cart"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="shadow rounded-lg p-6 mb-8"
      style={{ backgroundColor: "#1d1d1d" }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#d4af37" }}>
        Analytics Overview
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#ffffff" }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm" style={{ color: "#cccccc" }}>
          Distribution of user interactions across different metrics
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPieChart;
