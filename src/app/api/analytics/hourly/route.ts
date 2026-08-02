import { NextResponse } from "next/server";
import { getHourlyLoad } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getHourlyLoad());
}
