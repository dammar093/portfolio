import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { UserRole } from "@/generated/prisma/client";
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/error",
  },

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 🔥 1 hour in seconds
    updateAge: 15 * 60, // refresh JWT every 15 minutes if active
  },

  jwt: {
    maxAge: 60 * 60, // 🔥 1 hour
  },

  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },

    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.image = session.user.image;
        return token;
      }

      if (!token.sub) return token;

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!user) return token;

      token.role = user.role;
      token.name = user.name;
      token.email = user.email;
      token.avatar = user.avatar;

      return token;
    },
  },

  ...authConfig,
});
