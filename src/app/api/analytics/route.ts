import { NextRequest, NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics/aggregator";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const platform = searchParams.get("platform") || "all";
  const utmSource = searchParams.get("utmSource") || "all";

  const to = toParam ? new Date(toParam) : new Date();
  const from = fromParam ? new Date(fromParam) : subDays(to, 30);

  try {
    const data = await getAnalytics({ from, to, platform, utmSource });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
