import { ParseResult } from "@/types/webhook";
import crypto from "crypto";

export function parseKiwify(
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string,
  signature: string
): ParseResult {
  if (secret && signature) {
    const expected = crypto
      .createHmac("sha1", secret)
      .update(rawBody)
      .digest("hex");
    if (expected !== signature) {
      return { success: false, eventType: "unknown", error: "Invalid signature" };
    }
  }

  const orderStatus = payload.order_status as string;
  const statusMap: Record<string, "approved" | "refunded" | "pending" | "chargeback"> = {
    paid: "approved",
    refunded: "refunded",
    chargedback: "chargeback",
    waiting_payment: "pending",
    abandoned: "pending",
  };

  const status = statusMap[orderStatus] || "pending";
  const tracking = (payload.tracking_parameters as Record<string, unknown>) || {};
  const customer = (payload.Customer as Record<string, unknown>) || {};
  const product = (payload.Product as Record<string, unknown>) || {};

  return {
    success: true,
    eventType: orderStatus || "purchase",
    order: {
      externalId: (payload.order_id as string) || String(Date.now()),
      platform: "kiwify",
      status,
      amount: Math.round(((payload.order_total as number) || 0) * 100),
      currency: "BRL",
      productName: (product.name as string) || "Produto Kiwify",
      customerEmail: (customer.email as string) || "",
      customerName: (customer.full_name as string) || "",
      utmSource: (tracking.utm_source as string) || undefined,
      utmMedium: (tracking.utm_medium as string) || undefined,
      utmCampaign: (tracking.utm_campaign as string) || undefined,
      utmContent: (tracking.utm_content as string) || undefined,
      utmTerm: (tracking.utm_term as string) || undefined,
    },
  };
}
