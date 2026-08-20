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

    const record = await saveAnalyticsRecord({
      download: payload.download,
      upload: payload.upload,
      ping: payload.ping,
      jitter: payload.jitter ?? 0,
      packetLoss: payload.packetLoss ?? 0,
      isp: payload.isp ?? null,
      asn: payload.asn ?? null,
      country: payload.country ?? null,
      province: payload.province ?? null,
      district: payload.district ?? null,
      city: payload.city ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      browser: payload.browser ?? null,
      operatingSystem: payload.operatingSystem ?? null,
      deviceType: payload.deviceType ?? null,
      networkType: payload.networkType ?? null,
      server: payload.server ?? null,
      ipAddress: payload.ipAddress ?? null,
      timestamp: payload.timestamp ?? new Date(),
    });

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid analytics payload";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
