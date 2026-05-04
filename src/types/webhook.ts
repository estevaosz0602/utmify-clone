export interface NormalizedOrder {
  externalId: string;
  platform: string;
  status: "approved" | "refunded" | "pending" | "chargeback";
  amount: number;
  currency: string;
  productName: string;
  customerEmail: string;
  customerName: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface ParseResult {
  success: boolean;
  order?: NormalizedOrder;
  eventType: string;
  error?: string;
}

export type Platform =
  | "hotmart"
  | "kiwify"
  | "eduzz"
  | "ticto"
  | "perfectpay";

export const PLATFORMS: Platform[] = [
  "hotmart",
  "kiwify",
  "eduzz",
  "ticto",
  "perfectpay",
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  hotmart: "Hotmart",
  kiwify: "Kiwify",
  eduzz: "Eduzz",
  ticto: "Ticto",
  perfectpay: "PerfectPay",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  hotmart: "#ff4d00",
  kiwify: "#6c47ff",
  eduzz: "#0070f3",
  ticto: "#00c46a",
  perfectpay: "#ff6b35",
};
