import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ReviewTrendsChart = ({ data }) => {
  // Fill in missing dates with 0 values for a complete line graph
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) {
      return [];
    }

    const dates = rawData.map((d) => new Date(d.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const filledData = [];
    const dataMap = {};

    // Create map for quick lookup
    rawData.forEach((d) => {
      dataMap[d.date] = d.reviews;
    });

    // Fill in all dates in range
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      filledData.push({
        date: dateStr,
        reviews: dataMap[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  };

  const processedData = processData(data);

  return (
    <div
      className="shadow rounded-lg p-6"
      style={{ backgroundColor: "#1d1d1d", color: "#ffffff" }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "#d4af37" }}>
        Review Trends
      </h3>
      {processedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              stroke="#cccccc"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis stroke="#cccccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2d2d2d",
                border: "1px solid #d4af37",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="reviews"
              stroke="#d4af37"
              strokeWidth={3}
              dot={{ fill: "#d4af37", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
              name="Reviews"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="flex items-center justify-center h-80"
          style={{ color: "#999999" }}
        >
          No data available
        </div>
      )}
    </div>
  );
};

export default ReviewTrendsChart;
