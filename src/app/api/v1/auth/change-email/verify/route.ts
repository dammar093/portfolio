import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_OTP_TTL_MS, hashOtp } from "@/lib/auth-otp";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({ code: z.string().regex(/^\d{6}$/) });

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const email = auth.session?.user?.email;
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Enter the six digit code" }, { status: 400 });
  const otp = await prisma.authOtp.findFirst({ where: { email, purpose: "email-change" } });
  if (!otp || !otp.newEmail || otp.expiresAt <= new Date() || otp.createdAt.getTime() + AUTH_OTP_TTL_MS <= Date.now() || otp.attempts >= 5 || otp.codeHash !== hashOtp(parsed.data.code)) {
    if (otp && otp.attempts < 5) await prisma.authOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 });
  }
  if (await prisma.user.findUnique({ where: { email: otp.newEmail } })) return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
  await prisma.$transaction([prisma.user.update({ where: { email }, data: { email: otp.newEmail } }), prisma.authOtp.delete({ where: { id: otp.id } })]);
  return NextResponse.json({ message: "Email updated successfully. Please sign in again." });
}
