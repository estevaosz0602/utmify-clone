import { ParseResult } from "@/types/webhook";

export function parseEduzz(
  payload: Record<string, unknown>,
  rawBody: string,
  secret: string
): ParseResult {
  const apiKey = payload.api_key as string;
  if (secret && apiKey !== secret) {
    return { success: false, eventType: "unknown", error: "Invalid api_key" };
  }

  const transStatus = Number(payload.trans_status);
  const statusMap: Record<number, "approved" | "refunded" | "pending" | "chargeback"> = {
    3: "approved",
    4: "refunded",
    7: "chargeback",
    1: "pending",
    2: "pending",
    6: "pending",
  };

  const status = statusMap[transStatus] || "pending";

  return {
    success: true,
    eventType: `status_${transStatus}`,
    order: {
      externalId: String(payload.trans_cod || Date.now()),
      platform: "eduzz",
      status,
      amount: Math.round(((payload.trans_value as number) || 0) * 100),
      currency: "BRL",
      productName: (payload.prod_name as string) || "Produto Eduzz",
      customerEmail: (payload.cli_email as string) || "",
      customerName: (payload.cli_nome as string) || "",
      utmSource: (payload.uv_utm_source as string) || undefined,
      utmMedium: (payload.uv_utm_medium as string) || undefined,
      utmCampaign: (payload.uv_utm_campaign as string) || undefined,
      utmContent: (payload.uv_utm_content as string) || undefined,
      utmTerm: (payload.uv_utm_term as string) || undefined,
    },
  };
}
