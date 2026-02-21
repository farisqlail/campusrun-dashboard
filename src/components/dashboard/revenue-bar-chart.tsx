'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenuePerDay = [
  { day: "Sen", total: 410000 },
  { day: "Sel", total: 520000 },
  { day: "Rab", total: 610000 },
  { day: "Kam", total: 680000 },
  { day: "Jum", total: 820000 },
  { day: "Sab", total: 470000 },
  { day: "Min", total: 390000 },
];

export function RevenueBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={revenuePerDay}>
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
          width={50}
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
        <Bar dataKey="total" fill="#22c55e" radius={3} />
      </BarChart>
    </ResponsiveContainer>
  );
}

