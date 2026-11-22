import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
  ".svg",
]);

function safeFolder(input: string) {
  const cleaned = (input || "misc").replace(/[^a-zA-Z0-9/_-]/g, "");
  if (cleaned.includes("..")) throw new Error("Invalid folder");
  return cleaned.replace(/^\/+/, "").replace(/\/+$/, "");
}

export async function uploadImage(file: File, folder: string) {
  if (!file) throw new Error("No file provided");

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 2MB");
  }

  const ext = path.extname(file.name).toLowerCase();

  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Unsupported file type");
  }

  const fileName = `${crypto.randomUUID()}${ext}`;

  const safeDir = safeFolder(folder);

  // Vercel function filesystems are read-only and ephemeral. Store production
  // uploads in Blob so they remain available across deployments and instances.
  if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
    if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
      throw new Error(
        "Connect a Vercel Blob store to this project before uploading files.",
      );
    }

    const pathname = path.posix.join(safeDir, fileName);

    await put(
      pathname,
      file,
      {
        access: "private",
        addRandomSuffix: false,
        contentType: file.type || undefined,
      },
    );

    return {
      path: `/api/blob?pathname=${encodeURIComponent(pathname)}`,
      size: file.size,
    };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeDir);

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  // Ensure file exists after write
  await fs.access(filePath);

  return {
    path: `/uploads/${safeDir}/${fileName}`,
    size: file.size,
  };
}
