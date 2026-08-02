import { NextResponse } from "next/server";
import { getDailyTrend } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(parseInt(searchParams.get("days") || "7", 10) || 7, 1), 90);

  const dailyTests = await getDailyTrend(days);
  return NextResponse.json(dailyTests);
}
