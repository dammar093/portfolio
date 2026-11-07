export const runtime = "nodejs";

import fs from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: fileParts } = await context.params;

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", ...fileParts);

    const file = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();

    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
              ? "image/gif"
              : "application/octet-stream";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}