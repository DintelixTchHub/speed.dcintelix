import { NextResponse } from "next/server";
import { getRegionalStats } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";
  const stats = await getRegionalStats(range);
  return NextResponse.json(stats);
}
