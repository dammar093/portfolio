import { authOptions } from "@/auth";
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

export function POST(request: NextRequest) {
  return nextAuthHandler(request, {
    params: { nextauth: ["signout"] },
  });
}
