import { Suspense } from "react";
import { subDays } from "date-fns";
import { getAnalytics } from "@/lib/analytics/aggregator";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UtmTable } from "@/components/utm/utm-table";
import { CampaignChart } from "@/components/utm/campaign-chart";

interface PageProps {
  searchParams: Promise<{ days?: string; platform?: string }>;
}

export default async function UtmPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const days = Number(sp.days || "30");
  const platform = sp.platform || "all";

  const to = new Date();
  const from = days === 0 ? new Date(new Date().setHours(0, 0, 0, 0)) : subDays(to, days);

  const data = await getAnalytics({ from, to, platform });

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={null}>
        <Topbar title="UTM Analytics" />
      </Suspense>

      <div className="p-6 space-y-6">
        {/* Source + Campaign charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-white mb-4">Receita por utm_source</h3>
            {data.byUtmSource.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>
                Nenhum dado disponível
              </p>
            ) : (
              <CampaignChart
                data={data.byUtmSource.map((d) => ({ name: d.source, revenue: d.revenue, orders: d.orders }))}
                color="#7c3aed"
              />
            )}
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-white mb-4">Receita por utm_campaign</h3>
            {data.byUtmCampaign.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>
                Nenhum dado disponível
              </p>
            ) : (
              <CampaignChart
                data={data.byUtmCampaign.map((d) => ({ name: d.campaign, revenue: d.revenue, orders: d.orders }))}
                color="#10b981"
              />
            )}
          </div>
        </div>

        {/* Detailed table */}
        <UtmTable sourceData={data.byUtmSource} campaignData={data.byUtmCampaign} />
      </div>
    </div>
  );
}
