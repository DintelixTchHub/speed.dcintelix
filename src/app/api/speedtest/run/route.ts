import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
    timestamp: new Date().toISOString(),
  });
}
