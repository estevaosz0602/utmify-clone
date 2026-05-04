import { Suspense } from "react";
import { subDays } from "date-fns";
import { DollarSign, ShoppingCart, TrendingUp, Percent } from "lucide-react";
import { getAnalytics } from "@/lib/analytics/aggregator";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UtmBreakdown } from "@/components/dashboard/utm-breakdown";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ days?: string; platform?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const days = Number(sp.days || "30");
  const platform = sp.platform || "all";

  const to = new Date();
  const from = days === 0 ? new Date(new Date().setHours(0, 0, 0, 0)) : subDays(to, days);

  const data = await getAnalytics({ from, to, platform });

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={null}>
        <Topbar title="Resumo" />
      </Suspense>

      <div className="p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="Receita Aprovada"
            value={formatCurrency(data.summary.totalRevenue)}
            subtitle={`${data.summary.approvedOrders} pedidos aprovados`}
            icon={DollarSign}
            accent="#7c3aed"
          />
          <MetricCard
            title="Total de Pedidos"
            value={formatNumber(data.summary.totalOrders)}
            subtitle="todos os status"
            icon={ShoppingCart}
            accent="#10b981"
          />
          <MetricCard
            title="Taxa de Aprovação"
            value={formatPercent(data.summary.conversionRate)}
            subtitle="pedidos aprovados / total"
            icon={Percent}
            accent="#f59e0b"
          />
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(data.summary.avgOrderValue)}
            subtitle="por pedido aprovado"
            icon={TrendingUp}
            accent="#06b6d4"
          />
        </div>

        {/* Chart + UTM breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <RevenueChart data={data.revenueByDay} />
          </div>
          <div>
            <UtmBreakdown data={data.byUtmSource} />
          </div>
        </div>

        {/* Platform breakdown */}
        {data.byPlatform.length > 0 && (
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-white mb-4">Por plataforma</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {data.byPlatform.map((p) => (
                <div
                  key={p.platform}
                  className="rounded-lg p-3 text-center"
                  style={{ background: "var(--background)" }}
                >
                  <p className="text-xs font-medium mb-1 capitalize" style={{ color: "var(--muted)" }}>
                    {p.platform}
                  </p>
                  <p className="text-sm font-bold text-white">{formatCurrency(p.revenue)}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {p.orders} pedidos
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <RecentOrders orders={data.recentOrders} />
      </div>
    </div>
  );
}
