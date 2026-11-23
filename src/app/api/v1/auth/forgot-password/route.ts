import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_OTP_TTL_MS, createOtp, sendAuthOtp } from "@/lib/auth-otp";
import { consumeAuthRateLimit, getRequestIp, rateLimitKey } from "@/lib/auth-rate-limit";
import { z } from "zod";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
  const { email } = parsed.data;
  try {
    const ipLimit = await consumeAuthRateLimit(rateLimitKey(`forgot-ip:${getRequestIp(req.headers)}`), 10);
    const emailLimit = await consumeAuthRateLimit(rateLimitKey(`forgot-email:${email}`), 3);
    if (!ipLimit.allowed || !emailLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfter, emailLimit.retryAfter);
      return NextResponse.json(
        { message: "Too many reset requests. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const now = new Date();
      const existingOtp = await prisma.authOtp.findFirst({
        where: { email, purpose: "password-reset", expiresAt: { gt: now }, createdAt: { gt: new Date(now.getTime() - AUTH_OTP_TTL_MS) } },
      });
      if (existingOtp) {
        return NextResponse.json({ message: "If an account exists for that email, a verification code has been sent." });
      }
      const { code, codeHash } = createOtp();
      await prisma.authOtp.deleteMany({ where: { email, purpose: "password-reset" } });
      await prisma.authOtp.create({ data: { email, purpose: "password-reset", codeHash, expiresAt: new Date(Date.now() + AUTH_OTP_TTL_MS) } });
      try {
      await sendAuthOtp(email, code, "password-reset");
      } catch (err) {
        await prisma.authOtp.deleteMany({ where: { email, purpose: "password-reset" } });
        console.error("Password reset email failed", err);
        return NextResponse.json({ message: "Could not send verification email" }, { status: 500 });
      }
    }
    return NextResponse.json({ message: "If an account exists for that email, a verification code has been sent." });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    console.error("Password reset request failed", err);
    if (code === "P2021") {
      return NextResponse.json({ message: "The authentication database migration is missing. Apply pending Prisma migrations to the database used by this app." }, { status: 503 });
    }
    return NextResponse.json({ message: "Could not process the password reset request" }, { status: 500 });
  }
}
