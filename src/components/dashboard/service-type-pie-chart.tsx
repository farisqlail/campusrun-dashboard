'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const serviceTypeData = [
  { type: "food", label: "Food", value: 52 },
  { type: "print", label: "Print", value: 18 },
  { type: "document", label: "Dokumen", value: 14 },
  { type: "koperasi", label: "Koperasi", value: 9 },
  { type: "other", label: "Lainnya", value: 7 },
];

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#a855f7", "#64748b"];

export function ServiceTypePieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={serviceTypeData}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={4}
        >
          {serviceTypeData.map((entry, index) => (
            <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            borderColor: "#020617",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "#e5e7eb", marginBottom: 4 }}
          formatter={(value: unknown, name: unknown) => [
            `${value} order`,
            String(name),
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

