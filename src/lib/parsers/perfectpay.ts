import { ParseResult } from "@/types/webhook";

export function parsePerfectPay(
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string
): ParseResult {
  const token = payload.token as string;
  if (secret && token !== secret) {
    return { success: false, eventType: "unknown", error: "Invalid token" };
  }

  const saleStatus = (payload.sale_status as string) || "";
  const statusMap: Record<string, "approved" | "refunded" | "pending" | "chargeback"> = {
    approved: "approved",
    refunded: "refunded",
    chargeback: "chargeback",
    pending: "pending",
    waiting_payment: "pending",
    canceled: "refunded",
  };

  const status = statusMap[saleStatus] || "pending";
  const utmData = (payload.utm_data as Record<string, unknown>) || {};
  const customer = (payload.customer as Record<string, unknown>) || {};

  return {
    success: true,
    eventType: saleStatus || "purchase",
    order: {
      externalId: (payload.sale_id as string) || String(Date.now()),
      platform: "perfectpay",
      status,
      amount: Math.round(((payload.sale_amount as number) || 0) * 100),
      currency: "BRL",
      productName: (payload.product_name as string) || "Produto PerfectPay",
      customerEmail: (customer.email as string) || "",
      customerName: (customer.name as string) || "",
      utmSource: (utmData.utm_source as string) || undefined,
      utmMedium: (utmData.utm_medium as string) || undefined,
      utmCampaign: (utmData.utm_campaign as string) || undefined,
      utmContent: (utmData.utm_content as string) || undefined,
      utmTerm: (utmData.utm_term as string) || undefined,
    },
  };
}
