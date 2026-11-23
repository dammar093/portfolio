import { createHash, randomInt } from "crypto";
import nodemailer from "nodemailer";
import { loadEmailTemplate } from "@/lib/email/email-template";

export const AUTH_OTP_TTL_MS = 5 * 60_000;

export function createOtp() {
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  return { code, codeHash: createHash("sha256").update(code).digest("hex") };
}

export function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function sendAuthOtp(to: string, code: string, purpose: "password-reset" | "email-change") {
  const sender = process.env.MAIL_FROM || process.env.SMTP_USER;
  if (!sender || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("Email environment variables are not configured");
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  const isPassword = purpose === "password-reset";
  const title = isPassword ? "Reset your password" : "Verify your new email";
  const html = await loadEmailTemplate("auth-otp.html", {
    TITLE: title,
    DESCRIPTION: isPassword
      ? "Use this verification code to reset your password."
      : "Use this verification code to confirm your new email address.",
    OTP: code,
  });
  await transporter.sendMail({
    from: sender,
    to,
    subject: title,
    html,
  });
}
