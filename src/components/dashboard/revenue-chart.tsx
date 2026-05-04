"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RevenueByDay } from "@/types/analytics";

function fmt(v: number) {
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
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "revenue"
            ? `Receita: ${fmt(p.value)}`
            : `Pedidos: ${p.value}`}
        </p>
      ))}
    </div>
  );
};

export function RevenueChart({ data }: { data: RevenueByDay[] }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Receita por dia</h3>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
            Receita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Pedidos
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => {
              const d = new Date(v + "T00:00:00");
              return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
            }}
          />
          <YAxis
            yAxisId="revenue"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmt}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
          <Area
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
