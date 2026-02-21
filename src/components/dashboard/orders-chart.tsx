'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

const ordersPerDay = [
  { day: "Sen", total: 42 },
  { day: "Sel", total: 58 },
  { day: "Rab", total: 65 },
  { day: "Kam", total: 71 },
  { day: "Jum", total: 88 },
  { day: "Sab", total: 53 },
  { day: "Min", total: 41 },
];

export function OrdersChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={ordersPerDay}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1f2937"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={8}
          stroke="#6b7280"
        />
        <YAxis
          tickLine={false}
          tickMargin={8}
          stroke="#6b7280"
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            borderColor: "#020617",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "#e5e7eb", marginBottom: 4 }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

