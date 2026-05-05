import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLATFORMS } from "@/types/webhook";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const configs = await prisma.webhookConfig.findMany();
  const masked = configs.map((c: (typeof configs)[number]) => ({
    ...c,
    secretToken: c.secretToken.slice(0, 8) + "••••••••",
  }));
  return NextResponse.json(masked);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { platform, regenerate } = body;

  if (!PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }

  const existing = await prisma.webhookConfig.findUnique({
    where: { platform },
  });

  const secretToken =
    !existing || regenerate
      ? crypto.randomBytes(32).toString("hex")
      : existing.secretToken;

  const config = await prisma.webhookConfig.upsert({
    where: { platform },
    update: { secretToken, isActive: true },
    create: { platform, secretToken },
  });

  return NextResponse.json({
    ...config,
    secretToken,
  });
}
