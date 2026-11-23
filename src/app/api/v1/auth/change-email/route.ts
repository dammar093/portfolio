import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_OTP_TTL_MS, createOtp, sendAuthOtp } from "@/lib/auth-otp";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({ newEmail: z.string().trim().toLowerCase().email() });

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
  const email = auth.session?.user?.email;
  const newEmail = parsed.data.newEmail;
  if (!email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (newEmail === email) return NextResponse.json({ message: "Enter a different email address" }, { status: 400 });
  if (await prisma.user.findUnique({ where: { email: newEmail } })) return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
  const now = new Date();
  const activeOtp = await prisma.authOtp.findFirst({ where: { email, purpose: "email-change", expiresAt: { gt: now }, createdAt: { gt: new Date(now.getTime() - AUTH_OTP_TTL_MS) } } });
  if (activeOtp) return NextResponse.json({ message: "A verification code is already active. Check your inbox or wait five minutes before requesting another." });
  const { code, codeHash } = createOtp();
  await prisma.authOtp.deleteMany({ where: { email, purpose: "email-change" } });
  await prisma.authOtp.create({ data: { email, purpose: "email-change", newEmail, codeHash, expiresAt: new Date(Date.now() + AUTH_OTP_TTL_MS) } });
  try {
    await sendAuthOtp(newEmail, code, "email-change");
  } catch (err) {
    await prisma.authOtp.deleteMany({ where: { email, purpose: "email-change" } });
    console.error("Email change verification failed", err);
    return NextResponse.json({ message: "Could not send verification email" }, { status: 500 });
  }
  return NextResponse.json({ message: "A verification code was sent to your new email address." });
}
