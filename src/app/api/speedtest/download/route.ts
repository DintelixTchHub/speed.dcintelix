import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CONTENT_LENGTH = 50 * 1024 * 1024;
const CHUNK_SIZE = 5 * 1024 * 1024;

const buffer = Buffer.alloc(CONTENT_LENGTH);
for (let i = 0; i < CONTENT_LENGTH; i++) {
  buffer[i] = (i * 251 + 71) % 251;
}

export async function GET(request: NextRequest) {
  let offset = 0;
  let size = CONTENT_LENGTH;
  const range = request.headers.get("range");

  if (range) {
    const match = /bytes=(\d+)-?(\d*)/.exec(range || "");
    if (match) {
      offset = Math.max(0, parseInt(match[1], 10));
      if (match[2]) {
        size = Math.min(CONTENT_LENGTH - offset, parseInt(match[2], 10) - offset + 1);
      }
    }
  }

  if (offset >= CONTENT_LENGTH) {
    return new NextResponse(null, { status: 416 });
  }

  const body = buffer.slice(offset, offset + size);

  const headers = new Headers();
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Content-Length", String(body.length));
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  headers.set("Vary", "*");
  headers.set("Connection", "keep-alive");
  headers.set("Accept-Ranges", "bytes");
  if (range) {
    headers.set("Content-Range", `bytes ${offset}-${offset + body.length - 1}/${CONTENT_LENGTH}`);
  }

  return new NextResponse(body, {
    status: range ? 206 : 200,
    headers,
  });
}
