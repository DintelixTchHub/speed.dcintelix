import { NextResponse } from "next/server";
import { getISPList } from "@/lib/analytics-db";

export const runtime = "nodejs";

export async function GET() {
  const ispList = await getISPList();
  return NextResponse.json(ispList);
}
