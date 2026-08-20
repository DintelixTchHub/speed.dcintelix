import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SIZE = 10 * 1024 * 1024; // 10 MiB
const MAX_SIZE = 250 * 1024 * 1024; // 250 MiB
const CHUNK_SIZE = 1024 * 1024; // 1 MiB
const PATTERN_SIZE = 64 * 1024; // 64 KiB

/**
 * Generate a deterministic, non-compressible pattern.
 */
const pattern = new Uint8Array(PATTERN_SIZE);

for (let i = 0; i < PATTERN_SIZE; i++) {
  pattern[i] = (i * 251 + 71) % 251;
}

/**
 * Reusable 1 MiB chunk.
 *
 * This is created once and reused for every request.
 * We don't allocate a new 1 MiB buffer for every stream pull.
 */
const chunk = new Uint8Array(CHUNK_SIZE);

for (let offset = 0; offset < CHUNK_SIZE; offset += PATTERN_SIZE) {
  const length = Math.min(
    PATTERN_SIZE,
    CHUNK_SIZE - offset
  );

  chunk.set(
    pattern.subarray(0, length),
    offset
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const requestedSize = Number(
    searchParams.get("size")
  );

  /**
   * Validate requested size.
   *
   * If no size is provided, use 10 MiB.
   */
  const size =
    Number.isFinite(requestedSize) &&
    requestedSize > 0
      ? Math.min(
          Math.floor(requestedSize),
          MAX_SIZE
        )
      : DEFAULT_SIZE;

  const signal = request.signal;

  let bytesSent = 0;

  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (signal.aborted) {
        controller.close();
        return;
      }

      if (bytesSent >= size) {
        controller.close();
        return;
      }

      const remaining = size - bytesSent;

      if (remaining >= CHUNK_SIZE) {
        controller.enqueue(chunk);
        bytesSent += CHUNK_SIZE;
        return;
      }

      /**
       * Last chunk.
       *
       * Only allocate when we actually need a partial chunk.
       */
      const finalChunk = chunk.slice(0, remaining);

      controller.enqueue(finalChunk);

      bytesSent += remaining;

      controller.close();
    },

    cancel() {
      // Client stopped downloading.
    },
  });

  return new Response(stream, {
    status: 200,

    headers: {
      "Content-Type": "application/octet-stream",

      /**
       * Speed-test responses must never be cached.
       */
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",

      "Pragma": "no-cache",
      "Expires": "0",

      /**
       * Compression must not be applied.
       *
       * Otherwise a highly compressible response could
       * produce an artificially high measured speed.
       */
      "Content-Encoding": "identity",

      "X-Content-Type-Options": "nosniff",

      /**
       * We know exactly how many bytes will be sent.
       */
      "Content-Length": String(size),
    },
  });
}