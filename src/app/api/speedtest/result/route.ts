import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveAnalyticsRecord } from "@/lib/analytics-db";

const resultSchema = z.object({
  testId: z.string().optional().nullable(),
  server: z
    .object({
      name: z.string().optional().nullable(),
      location: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  latency: z.number().finite().nonNegative(),
  downloadMbps: z.number().finite().nonNegative(),
  uploadMbps: z.number().finite().nonNegative(),
  jitter: z.number().finite().nonNegative().optional(),
  packetLoss: z.number().finite().nonNegative().optional().nullable(),
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
  ipAddress: z.string().optional().nullable(),
  timestamp: z.union([z.string(), z.date()]).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = resultSchema.parse(body);

    const serverName =
      (payload.server?.name && payload.server.name.trim()) ||
      process.env.SPEEDTEST_SERVER_NAME ||
      "DCintelix Kigali";

    const serverLocation =
      (payload.server?.location && payload.server.location.trim()) ||
      process.env.SPEEDTEST_SERVER_LOCATION ||
      "Kigali, Rwanda";

    const record = await saveAnalyticsRecord({
      download: payload.downloadMbps,
      upload: payload.uploadMbps,
      ping: payload.latency,
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
      server: serverName,
      ipAddress: payload.ipAddress ?? null,
      timestamp: payload.timestamp ?? new Date(),
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid result payload";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
