import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PARSERS } from "@/lib/parsers";
import { PLATFORMS } from "@/types/webhook";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;

  if (!PLATFORMS.includes(platform as never)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 404 });
  }

  const rawBody = await request.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    headers[k] = v;
  });

  const query: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((v, k) => {
    query[k] = v;
  });

  const config = await prisma.webhookConfig.findUnique({
    where: { platform },
  });
  const secret = config?.secretToken || "";

  const parser = PARSERS[platform];
  const result = parser(payload, rawBody, secret, { ...headers, ...query });

  if (!result.success || !result.order) {
    await prisma.webhookEvent.create({
      data: {
        platform,
        eventType: result.eventType,
        status: "error",
        payload: rawBody,
        error: result.error,
      },
    });
    return NextResponse.json({ ok: true });
  }

  const { order } = result;

  try {
    const saved = await prisma.order.upsert({
      where: { externalId: order.externalId },
      update: {
        status: order.status,
        amount: order.amount,
        updatedAt: new Date(),
      },
      create: {
        externalId: order.externalId,
        platform: order.platform,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        productName: order.productName,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        utmSource: order.utmSource || null,
        utmMedium: order.utmMedium || null,
        utmCampaign: order.utmCampaign || null,
        utmContent: order.utmContent || null,
        utmTerm: order.utmTerm || null,
        rawPayload: rawBody,
      },
    });

    await prisma.webhookEvent.create({
      data: {
        platform,
        eventType: result.eventType,
        status: "success",
        payload: rawBody,
        orderId: saved.id,
      },
    });
  } catch (err) {
    await prisma.webhookEvent.create({
      data: {
        platform,
        eventType: result.eventType,
        status: "error",
        payload: rawBody,
        error: String(err),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
