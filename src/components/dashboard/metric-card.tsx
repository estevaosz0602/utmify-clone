import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon?: LucideIcon;
  accent?: string;
}

export function MetricCard({ title, value, subtitle, trend, icon: Icon, accent }: MetricCardProps) {
  const trendPositive = (trend ?? 0) >= 0;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          {title}
        </span>
        {Icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: accent ? `${accent}20` : "rgba(124,58,237,0.12)" }}
          >
            <Icon size={15} style={{ color: accent || "var(--accent-light)" }} />
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium">
          {trendPositive ? (
            <TrendingUp size={13} style={{ color: "var(--green)" }} />
          ) : (
            <TrendingDown size={13} style={{ color: "var(--red)" }} />
          )}
          <span style={{ color: trendPositive ? "var(--green)" : "var(--red)" }}>
            {trendPositive ? "+" : ""}
            {trend?.toFixed(1)}%
          </span>
          <span style={{ color: "var(--muted)" }}>vs. período anterior</span>
        </div>
      )}
    </div>
  );
}
