import { authOptions } from "@/auth";
import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { consumeAuthRateLimit, getRequestIp, rateLimitKey, clearAuthRateLimit, authRateLimitStatus } from "@/lib/auth-rate-limit";

const nextAuthHandler = NextAuth(authOptions);

export async function POST(request: NextRequest) {
  const body = await request.clone().json().catch(() => null) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
  const ipKey = rateLimitKey(`login-ip:${getRequestIp(request.headers)}`);
  const emailKey = email ? rateLimitKey(`login-email:${email}`) : null;
  const ipLimit = await consumeAuthRateLimit(ipKey, 20);
  if (!ipLimit.allowed) {
    const retryAfter = ipLimit.retryAfter;
    return NextResponse.json(
      { message: "Too many sign-in attempts. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const response = await nextAuthHandler(request, {
    params: { nextauth: ["callback", "credentials"] },
  });
  const result = (await response.json()) as { url?: string; message?: string };
  const redirectUrl = result.url
    ? new URL(result.url, request.url)
    : undefined;

  if (redirectUrl?.searchParams.has("error")) {
    const emailLimit = emailKey ? await authRateLimitStatus(emailKey) : { limited: false, retryAfter: 0 };
    if (emailLimit.limited) {
      return NextResponse.json(
        { message: "Too many sign-in attempts for this account. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } },
      );
    }
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: response.status >= 400 ? response.status : 401, headers: response.headers }
    );
  }

  if (!response.ok || !redirectUrl) {
    return NextResponse.json(
      { message: result.message ?? "Unable to complete sign-in" },
      { status: response.status >= 400 ? response.status : 500, headers: response.headers }
    );
  }

  await Promise.all([
    clearAuthRateLimit(ipKey),
  ]);

  return NextResponse.json(
    { message: "Login successful", redirectTo: redirectUrl.toString() },
    { status: response.status, headers: response.headers }
  );
}
