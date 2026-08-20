import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    testId: "",
    server: {
      name: process.env.NEXT_PUBLIC_SPEEDTEST_SERVER_NAME || "DCintelix Kigali",
      location: process.env.NEXT_PUBLIC_SPEEDTEST_SERVER_LOCATION || "Kigali, Rwanda",
    },
    latency: 0,
    downloadMbps: 0,
    uploadMbps: 0,
  });
}
