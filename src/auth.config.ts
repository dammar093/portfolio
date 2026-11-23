
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/schema/auth-schema"
import { clearAuthRateLimit, consumeAuthRateLimit, rateLimitKey } from "@/lib/auth-rate-limit"

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validInputFields = loginSchema.safeParse(credentials);
        if (!validInputFields.success) return null;

        const { email, password } = validInputFields.data;
        const rateKey = rateLimitKey(`login-email:${email}`);
        const rateLimit = await consumeAuthRateLimit(rateKey, 8);
        if (!rateLimit.allowed) return null;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) return null;

        await clearAuthRateLimit(rateKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
        };
      }
    }),
  ]
} satisfies Pick<NextAuthOptions, "providers">
