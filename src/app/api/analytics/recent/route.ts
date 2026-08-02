import { NextResponse } from "next/server";
import { getRecentSpeedTests } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 10);
  return NextResponse.json(await getRecentSpeedTests(Math.max(1, Math.min(limit, 100))));
}
