import { ParseResult } from "@/types/webhook";
import crypto from "crypto";

export function parseHotmart(
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string,
  headers: Record<string, string>
): ParseResult {
  const token = headers["x-hotmart-webhook-token"];
  if (secret && token !== secret) {
    return { success: false, eventType: "unknown", error: "Invalid token" };
  }

  const event = (payload.event as string) || "UNKNOWN";
  const data = payload.data as Record<string, unknown>;
  if (!data) return { success: false, eventType: event, error: "No data" };

  const purchase = data.purchase as Record<string, unknown>;
  const buyer = data.buyer as Record<string, unknown>;
  const product = data.product as Record<string, unknown>;

  const statusMap: Record<string, "approved" | "refunded" | "pending" | "chargeback"> = {
    PURCHASE_COMPLETE: "approved",
    PURCHASE_APPROVED: "approved",
    PURCHASE_REFUNDED: "refunded",
    PURCHASE_CHARGEBACK: "chargeback",
    PURCHASE_CANCELED: "refunded",
    PURCHASE_BILLET_PRINTED: "pending",
    PURCHASE_WAITING_PAYMENT: "pending",
  };

  const status = statusMap[event] || "pending";

  const tracking = (purchase?.tracking as Record<string, unknown>) || {};
  const utmSource =
    (tracking.utm_source as string) ||
    (tracking.source_sck as string) ||
    undefined;

  const price = purchase?.price as Record<string, unknown>;

  return {
    success: true,
    eventType: event,
    order: {
      externalId: (purchase?.transaction as string) || String(Date.now()),
      platform: "hotmart",
      status,
      amount: Math.round(((price?.value as number) || 0) * 100),
      currency: (price?.currency_value as string) || "BRL",
      productName: (product?.name as string) || "Produto Hotmart",
      customerEmail: (buyer?.email as string) || "",
      customerName: (buyer?.name as string) || "",
      utmSource,
      utmMedium: (tracking.utm_medium as string) || undefined,
      utmCampaign: (tracking.utm_campaign as string) || undefined,
      utmContent: (tracking.utm_content as string) || undefined,
      utmTerm: (tracking.utm_term as string) || undefined,
    },
  };
}
