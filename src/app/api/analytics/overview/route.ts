import { NextResponse } from "next/server";
import { getAnalyticsOverview } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";

  const overview = await getAnalyticsOverview(range);
  return NextResponse.json(overview);
}
