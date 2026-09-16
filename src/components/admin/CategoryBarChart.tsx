"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CategoryBarChart({
  data,
}: {
  data: { category: string; count: number }[];
}) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e6e7eb"
            vertical={false}
          />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f6f7f9" }} />
          <Bar dataKey="count" fill="#b5502e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
