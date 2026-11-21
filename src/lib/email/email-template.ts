
import { readFile } from "fs/promises";
import path from "path";

type EmailTemplateData = Record<string, string | Date>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function loadEmailTemplate(
  filename: string,
  data: EmailTemplateData,
): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "email-templates",
    filename,
  );

  let html = await readFile(filePath, "utf-8");

  html = html.replace(/{{(\w+)}}/g, (match, key: string) => {
    const value = data[key];

    if (value === undefined || value === null) {
      return "";
    }

    if (value instanceof Date) {
      return escapeHtml(
        value.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kathmandu",
        }),
      );
    }

    const escapedValue = escapeHtml(String(value));

    // Preserve line breaks in message content.
    return key === "MESSAGE"
      ? escapedValue.replace(/\r?\n/g, "<br />")
      : escapedValue;
  });

  return html;
}
