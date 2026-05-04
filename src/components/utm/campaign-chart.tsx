"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function fmt(v: number) {
  if (v >= 10000000) return `R$${(v / 10000000).toFixed(1)}M`;
  if (v >= 100000) return `R$${(v / 100000).toFixed(1)}k`;
  return `R$${(v / 100).toFixed(0)}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{ background: "#1a1a2e", border: "1px solid var(--border)" }}
    >
      <p className="font-semibold text-white mb-1">{label}</p>
      <p style={{ color: "#a78bfa" }}>Receita: {fmt(payload[0]?.value || 0)}</p>
    </div>
  );
};

interface Props {
  data: { name: string; revenue: number; orders: number }[];
  color?: string;
}

export function CampaignChart({ data, color = "#7c3aed" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={fmt}
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue" fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
