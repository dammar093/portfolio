import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const PRIVATE_UPLOAD_PATH =
  /^(?:blogs|experiences|languages|pages|projects|seo|services|settings|testimonials)\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|jpeg|png|webp|gif|pdf|svg)$/i;

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");

  if (!pathname || !PRIVATE_UPLOAD_PATH.test(pathname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const blob = await get(pathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });

    if (!blob) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = {
      ETag: blob.blob.etag,
      "Cache-Control": "private, no-cache",
      "X-Content-Type-Options": "nosniff",
    };

    if (blob.statusCode === 304) {
      return new NextResponse(null, { status: 304, headers });
    }

    return new NextResponse(blob.stream, {
      headers: {
        ...headers,
        "Content-Type": blob.blob.contentType,
      },
    });
  } catch (error) {
    console.error("PRIVATE BLOB READ ERROR:", error);
    return new NextResponse("Unable to load file", { status: 500 });
  }
}
