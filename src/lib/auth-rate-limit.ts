import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60_000;

export function rateLimitKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/** Database-backed so limits are shared by Vercel serverless instances. */
export async function consumeAuthRateLimit(key: string, limit: number) {
  const now = new Date();
  const resetBefore = new Date(now.getTime() - WINDOW_MS);
  const blockUntil = new Date(now.getTime() + WINDOW_MS);
  const [result] = await prisma.$queryRaw<Array<{ attempts: number; blockedUntil: Date | null }>>`
    INSERT INTO "AuthRateLimit" ("key", "attempts", "windowStartedAt", "blockedUntil", "updatedAt")
    VALUES (${key}, 1, ${now}, NULL, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE
        WHEN "AuthRateLimit"."blockedUntil" > ${now} THEN "AuthRateLimit"."attempts"
        WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN 1
        ELSE "AuthRateLimit"."attempts" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "AuthRateLimit"."blockedUntil" > ${now} THEN "AuthRateLimit"."windowStartedAt"
        WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN ${now}
        ELSE "AuthRateLimit"."windowStartedAt"
      END,
      "blockedUntil" = CASE
        WHEN "AuthRateLimit"."blockedUntil" > ${now} THEN "AuthRateLimit"."blockedUntil"
        WHEN "AuthRateLimit"."windowStartedAt" <= ${resetBefore} THEN NULL
        WHEN "AuthRateLimit"."attempts" + 1 >= ${limit} THEN ${blockUntil}
        ELSE NULL
      END,
      "updatedAt" = ${now}
    RETURNING "attempts", "blockedUntil"
  `;
  if (result.blockedUntil && result.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((result.blockedUntil.getTime() - now.getTime()) / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

export async function clearAuthRateLimit(key: string) {
  await prisma.authRateLimit.deleteMany({ where: { key } });
}

export async function authRateLimitStatus(key: string) {
  const current = await prisma.authRateLimit.findUnique({ where: { key }, select: { blockedUntil: true } });
  const now = new Date();
  if (!current?.blockedUntil || current.blockedUntil <= now) return { limited: false, retryAfter: 0 };
  return {
    limited: true,
    retryAfter: Math.max(1, Math.ceil((current.blockedUntil.getTime() - now.getTime()) / 1000)),
  };
}

export function getRequestIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-real-ip")
    || "unknown";
}
