import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_UPLOAD_SIZE = 250 * 1024 * 1024; // 250 MiB

export async function POST(request: Request) {
  try {
    const signal = request.signal;
    const contentLength = request.headers.get("content-length");

    /**
     * Reject obviously oversized requests before reading them.
     */
    if (contentLength) {
      const declaredSize = Number(contentLength);

      if (
        !Number.isFinite(declaredSize) ||
        declaredSize < 0 ||
        declaredSize > MAX_UPLOAD_SIZE
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Upload size exceeds the allowed limit",
          },
          { status: 413 }
        );
      }
    }

    const reader = request.body?.getReader();

    if (!reader) {
      return NextResponse.json(
        {
          success: false,
          error: "Request body is required",
        },
        { status: 400 }
      );
    }

    let totalBytes = 0;

    try {
      while (true) {
        if (signal.aborted) {
          await reader.cancel();
          return new Response(null, {
            status: 499,
          });
        }

        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        if (value) {
          totalBytes += value.byteLength;

          /**
           * Protect the server even when Content-Length
           * is missing or incorrect.
           */
          if (totalBytes > MAX_UPLOAD_SIZE) {
            await reader.cancel();

            return NextResponse.json(
              {
                success: false,
                error: "Upload size exceeds the allowed limit",
              },
              { status: 413 }
            );
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return NextResponse.json(
      {
        success: true,
        bytesReceived: totalBytes,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    if (request.signal.aborted) {
      return new Response(null, {
        status: 499,
      });
    }

    console.error("Speed test upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}