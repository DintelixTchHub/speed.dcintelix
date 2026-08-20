import { NextResponse } from "next/server";
import { z } from "zod";
import { saveAnalyticsRecord } from "@/lib/analytics-db";

export const runtime = "nodejs";

const payloadSchema = z.object({
  download: z.number().finite(),
  upload: z.number().finite(),
  ping: z.number().finite(),
  jitter: z.number().finite().optional(),
  packetLoss: z.number().finite().optional().nullable(),
  isp: z.string().optional().nullable(),
  asn: z.number().int().optional().nullable(),
  country: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  latitude: z.number().finite().optional().nullable(),
  longitude: z.number().finite().optional().nullable(),
  browser: z.string().optional().nullable(),
  operatingSystem: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  networkType: z.string().optional().nullable(),
  server: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  timestamp: z.union([z.string(), z.date()]).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = payloadSchema.parse(body);

    const record = await saveAnalyticsRecord(payload);

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid analytics payload";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
