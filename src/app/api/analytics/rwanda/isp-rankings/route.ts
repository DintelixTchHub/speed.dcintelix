import { NextResponse } from "next/server";
import { getRwandaIspRankings } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";

  const rankings = await getRwandaIspRankings(range);

  return NextResponse.json(rankings);
}
