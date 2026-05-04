import { prisma } from "@/lib/prisma";
import { AnalyticsResponse } from "@/types/analytics";

export interface AnalyticsFilters {
  from: Date;
  to: Date;
  platform?: string;
  utmSource?: string;
}

export async function getAnalytics(
  filters: AnalyticsFilters
): Promise<AnalyticsResponse> {
  const where = {
    createdAt: { gte: filters.from, lte: filters.to },
    ...(filters.platform && filters.platform !== "all"
      ? { platform: filters.platform }
      : {}),
    ...(filters.utmSource && filters.utmSource !== "all"
      ? { utmSource: filters.utmSource }
      : {}),
  };

  const approvedWhere = { ...where, status: "approved" };

  const [allOrders, approvedOrders, bySourceRaw, byCampaignRaw, byPlatformRaw, recentOrders] =
    await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where: approvedWhere,
        _sum: { amount: true },
        _count: { id: true },
        _avg: { amount: true },
      }),
      prisma.order.groupBy({
        by: ["utmSource"],
        where: approvedWhere,
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ["utmCampaign"],
        where: approvedWhere,
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ["platform"],
        where: approvedWhere,
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: "desc" } },
      }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          externalId: true,
          platform: true,
          status: true,
          amount: true,
          productName: true,
          customerName: true,
          utmSource: true,
          utmCampaign: true,
          createdAt: true,
        },
      }),
    ]);

  const refundedCount = await prisma.order.count({
    where: { ...where, status: "refunded" },
  });

  const totalRevenue = approvedOrders._sum.amount || 0;
  const approvedCount = approvedOrders._count.id || 0;
  const avgOrderValue = approvedOrders._avg.amount || 0;

  const revenueByDayRaw = await prisma.$queryRaw<
    { date: string; revenue: number; orders: bigint }[]
  >`
    SELECT
      strftime('%Y-%m-%d', "createdAt") as date,
      SUM("amount") as revenue,
      COUNT(*) as orders
    FROM "Order"
    WHERE "status" = 'approved'
      AND "createdAt" >= ${filters.from.toISOString()}
      AND "createdAt" <= ${filters.to.toISOString()}
    GROUP BY strftime('%Y-%m-%d', "createdAt")
    ORDER BY date ASC
  `;

  return {
    summary: {
      totalRevenue,
      totalOrders: allOrders,
      approvedOrders: approvedCount,
      conversionRate: allOrders > 0 ? (approvedCount / allOrders) * 100 : 0,
      avgOrderValue,
      refundRate: approvedCount > 0 ? (refundedCount / approvedCount) * 100 : 0,
    },
    revenueByDay: revenueByDayRaw.map((r) => ({
      date: r.date,
      revenue: Number(r.revenue),
      orders: Number(r.orders),
    })),
    byUtmSource: bySourceRaw.map((r) => ({
      source: r.utmSource || "(direto)",
      revenue: r._sum.amount || 0,
      orders: r._count.id,
    })),
    byUtmCampaign: byCampaignRaw.map((r) => ({
      campaign: r.utmCampaign || "(sem campanha)",
      revenue: r._sum.amount || 0,
      orders: r._count.id,
    })),
    byPlatform: byPlatformRaw.map((r) => ({
      platform: r.platform,
      revenue: r._sum.amount || 0,
      orders: r._count.id,
    })),
    recentOrders: recentOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    })),
  };
}
