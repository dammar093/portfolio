
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/schema/auth-schema"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validInputFields = loginSchema.safeParse(credentials);
        if (validInputFields.success) {
          const { email, password } = validInputFields.data
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          })
          if (!user || !user.password) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }
        return null;
      }
    }),
  ]
} satisfies NextAuthConfig