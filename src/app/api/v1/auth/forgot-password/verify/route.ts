import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOtp } from "@/lib/auth-otp";
import { AUTH_OTP_TTL_MS } from "@/lib/auth-otp";
import { hashedPassword } from "@/utils/hash-password";
import { z } from "zod";

const schema = z.object({ email: z.string().trim().toLowerCase().email(), code: z.string().regex(/^\d{6}$/), newPassword: z.string().min(8).max(128), confirmPassword: z.string() }).refine((data) => data.newPassword === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Check the code and password fields", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const { email, code, newPassword } = parsed.data;
  const otp = await prisma.authOtp.findFirst({ where: { email, purpose: "password-reset" } });
  if (!otp || otp.expiresAt <= new Date() || otp.createdAt.getTime() + AUTH_OTP_TTL_MS <= Date.now() || otp.attempts >= 5 || otp.codeHash !== hashOtp(code)) {
    if (otp && otp.attempts < 5) await prisma.authOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 });
  }
  const password = await hashedPassword(newPassword);
  await prisma.$transaction([prisma.user.update({ where: { email }, data: { password } }), prisma.authOtp.delete({ where: { id: otp.id } })]);
  return NextResponse.json({ message: "Password reset successfully" });
}
