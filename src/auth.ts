import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET;

export const authOptions = {
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Account type", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const role = credentials?.role;

        if (
          !email ||
          !password ||
          (role !== "ADMIN" && role !== "USER")
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.role !== role || !(await compare(password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub && token.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
