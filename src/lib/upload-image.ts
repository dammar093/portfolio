import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${crypto.randomUUID()}${ext}`;

  const safeDir = safeFolder(folder);

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
