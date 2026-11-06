import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";
import {
  DEFAULT_REDIRECT_ADMIN_ROUTE,
  ADMIN_PROTECTED_ROUTES,
  DEFAULT_REDIRECT_LOGIN_ROUTE,
  ADMIN_PROTECTED_API_ROUTES_PREFIX,
  AUTH_ROUTES,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAdminApiRoute =
    nextUrl.pathname.startsWith(ADMIN_PROTECTED_API_ROUTES_PREFIX);

  const isAdminRoute =
    nextUrl.pathname.startsWith(ADMIN_PROTECTED_ROUTES);

  const isAuthRoute =
    AUTH_ROUTES.includes(nextUrl.pathname);

  // If user is logged in and tries to access login/register
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(DEFAULT_REDIRECT_ADMIN_ROUTE, nextUrl)
    );
  }

  // Protect admin pages and admin APIs
  if ((isAdminRoute || isAdminApiRoute) && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(DEFAULT_REDIRECT_LOGIN_ROUTE, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/v1/:path*",
    "/login",
    "/register",
  ],
};