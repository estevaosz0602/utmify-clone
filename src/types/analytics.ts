export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  approvedOrders: number;
  conversionRate: number;
  avgOrderValue: number;
  refundRate: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface UtmBreakdown {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  revenue: number;
  orders: number;
}

export interface PlatformBreakdown {
  platform: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  revenueByDay: RevenueByDay[];
  byUtmSource: { source: string; revenue: number; orders: number }[];
  byUtmCampaign: { campaign: string; revenue: number; orders: number }[];
  byPlatform: PlatformBreakdown[];
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  externalId: string;
  platform: string;
  status: string;
  amount: number;
  productName: string;
  customerName: string;
  utmSource: string | null;
  utmCampaign: string | null;
  createdAt: string;
}
