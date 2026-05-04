import { formatCurrency } from "@/lib/utils";
import { RecentOrder } from "@/types/analytics";
import { PLATFORM_LABELS, PLATFORM_COLORS } from "@/types/webhook";

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprovado",
  refunded: "Reembolsado",
  pending: "Pendente",
  chargeback: "Chargeback",
};

const STATUS_COLORS: Record<string, string> = {
  approved: "#10b981",
  refunded: "#ef4444",
  pending: "#f59e0b",
  chargeback: "#f59e0b",
};

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <div
      className="rounded-xl"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold text-white">Pedidos recentes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Cliente", "Produto", "Plataforma", "UTM Source", "Status", "Valor"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Nenhum pedido ainda. Configure os webhooks para começar a receber dados.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td className="px-5 py-3 text-white font-medium">{order.customerName || "—"}</td>
                <td className="px-5 py-3 max-w-[180px] truncate" style={{ color: "var(--muted)" }}>
                  {order.productName}
                </td>
                <td className="px-5 py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: `${PLATFORM_COLORS[order.platform as keyof typeof PLATFORM_COLORS] || "#64748b"}20`,
                      color: PLATFORM_COLORS[order.platform as keyof typeof PLATFORM_COLORS] || "#64748b",
                    }}
                  >
                    {PLATFORM_LABELS[order.platform as keyof typeof PLATFORM_LABELS] || order.platform}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>
                  {order.utmSource || "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: `${STATUS_COLORS[order.status] || "#64748b"}20`,
                      color: STATUS_COLORS[order.status] || "#64748b",
                    }}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-white">
                  {formatCurrency(order.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
