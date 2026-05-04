import { formatCurrency } from "@/lib/utils";

interface UtmRow {
  source: string;
  revenue: number;
  orders: number;
}

export function UtmBreakdown({ data }: { data: UtmRow[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Top fontes UTM</h3>
      <div className="space-y-3">
        {data.length === 0 && (
          <p className="text-sm py-6 text-center" style={{ color: "var(--muted)" }}>
            Nenhum dado disponível
          </p>
        )}
        {data.map((row) => (
          <div key={row.source} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">{row.source}</span>
              <div className="flex items-center gap-4">
                <span style={{ color: "var(--muted)" }}>{row.orders} pedidos</span>
                <span className="font-semibold text-white">{formatCurrency(row.revenue)}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(row.revenue / maxRevenue) * 100}%`,
                  background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
