import { formatCurrency } from "@/lib/utils";

interface UtmRow {
  source?: string;
  campaign?: string;
  revenue: number;
  orders: number;
}

interface Props {
  sourceData: { source: string; revenue: number; orders: number }[];
  campaignData: { campaign: string; revenue: number; orders: number }[];
}

export function UtmTable({ sourceData, campaignData }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <TableSection
        title="Por utm_source"
        rows={sourceData.map((d) => ({ label: d.source, revenue: d.revenue, orders: d.orders }))}
        labelHeader="Fonte"
      />
      <TableSection
        title="Por utm_campaign"
        rows={campaignData.map((d) => ({ label: d.campaign, revenue: d.revenue, orders: d.orders }))}
        labelHeader="Campanha"
      />
    </div>
  );
}

function TableSection({
  title,
  rows,
  labelHeader,
}: {
  title: string;
  rows: { label: string; revenue: number; orders: number }[];
  labelHeader: string;
}) {
  return (
    <div
      className="rounded-xl"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th className="text-left px-5 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              {labelHeader}
            </th>
            <th className="text-right px-5 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Pedidos
            </th>
            <th className="text-right px-5 py-3 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Receita
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-10 text-sm" style={{ color: "var(--muted)" }}>
                Nenhum dado disponível
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-white/[0.02] transition-colors"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <td className="px-5 py-3 font-medium text-white">{row.label}</td>
              <td className="px-5 py-3 text-right" style={{ color: "var(--muted)" }}>
                {row.orders}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-white">
                {formatCurrency(row.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
