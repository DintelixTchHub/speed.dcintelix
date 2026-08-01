import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const reader = request.body?.getReader();
    if (!reader) {
      return NextResponse.json({ success: false, error: "No stream" }, { status: 400 });
    }

    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (ArrayBuffer.isView(value)) totalBytes += value.byteLength;
    }

    return NextResponse.json({ success: true, bytes: totalBytes });
  } catch {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 400 });
  }
}
