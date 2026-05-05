import { ParseResult } from "@/types/webhook";

const STATUS_MAP: Record<string, "approved" | "refunded" | "pending" | "chargeback"> = {
  COMPLETED: "approved",
  PAID: "approved",
  PENDING: "pending",
  WAITING_PAYMENT: "pending",
  REFUNDED: "refunded",
  CHARGEDBACK: "chargeback",
  CANCELED: "refunded",
  EXPIRED: "refunded",
};

export function parseApplyfy(
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string
): ParseResult {
  const token = payload.token as string;
  if (secret && token !== secret) {
    return { success: false, eventType: "unknown", error: "Invalid token" };
  }

  const event = (payload.event as string) || "UNKNOWN";
  const transaction = payload.transaction as Record<string, unknown>;
  const client = payload.client as Record<string, unknown>;

  if (!transaction) {
    return { success: false, eventType: event, error: "No transaction data" };
  }

  const status = STATUS_MAP[transaction.status as string] || "pending";
  const trackProps = (transaction.trackProps as Record<string, unknown>) || {};
  const orderItems = (transaction.orderItems as Record<string, unknown>[]) || [];
  const firstProduct = orderItems[0]?.product as Record<string, unknown> | undefined;

  // amount is in full BRL (not cents), convert to cents
  const amount = Math.round(((transaction.amount as number) || 0) * 100);

  return {
    success: true,
    eventType: event,
    order: {
      externalId: (transaction.id as string) || String(Date.now()),
      platform: "applyfy",
      status,
      amount,
      currency: (transaction.currency as string) || "BRL",
      productName: (firstProduct?.name as string) || "Produto Applyfy",
      customerEmail: (client?.email as string) || "",
      customerName: (client?.name as string) || "",
      utmSource: (trackProps.utm_source as string) || undefined,
      utmMedium: (trackProps.utm_medium as string) || undefined,
      utmCampaign: (trackProps.utm_campaign as string) || undefined,
      utmContent: (trackProps.utm_content as string) || undefined,
      utmTerm: (trackProps.utm_term as string) || undefined,
    },
  };
}
