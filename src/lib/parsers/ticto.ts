import { ParseResult } from "@/types/webhook";
import crypto from "crypto";

export function parseTicto(
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string,
  headers: Record<string, string>
): ParseResult {
  const sig = headers["x-ticto-signature"];
  if (secret && sig) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (`sha256=${expected}` !== sig) {
      return { success: false, eventType: "unknown", error: "Invalid signature" };
    }
  }

  const event = (payload.event as string) || "purchase";
  const data = (payload.data as Record<string, unknown>) || {};
  const metadata = (data.metadata as Record<string, unknown>) || {};
  const customer = (data.customer as Record<string, unknown>) || {};
  const product = (data.product as Record<string, unknown>) || {};

  const statusMap: Record<string, "approved" | "refunded" | "pending" | "chargeback"> = {
    purchase_approved: "approved",
    purchase_complete: "approved",
    purchase_refunded: "refunded",
    purchase_chargeback: "chargeback",
    purchase_pending: "pending",
  };

  const status = statusMap[event] || "pending";

  return {
    success: true,
    eventType: event,
    order: {
      externalId: (data.id as string) || String(Date.now()),
      platform: "ticto",
      status,
      amount: Math.round(((data.amount as number) || 0)),
      currency: "BRL",
      productName: (product.name as string) || "Produto Ticto",
      customerEmail: (customer.email as string) || "",
      customerName: (customer.name as string) || "",
      utmSource: (metadata.utm_source as string) || undefined,
      utmMedium: (metadata.utm_medium as string) || undefined,
      utmCampaign: (metadata.utm_campaign as string) || undefined,
      utmContent: (metadata.utm_content as string) || undefined,
      utmTerm: (metadata.utm_term as string) || undefined,
    },
  };
}
