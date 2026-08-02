import { NextResponse } from "next/server";
import { getMonthlyGrowth } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getMonthlyGrowth());
}
