import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_PROTECTED_API_ROUTES_PREFIX,
  ADMIN_PROTECTED_ROUTES,
  AUTH_ROUTES,
  DEFAULT_REDIRECT_ADMIN_ROUTE,
  DEFAULT_REDIRECT_LOGIN_ROUTE,
} from "@/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminApiRoute = pathname.startsWith(
    ADMIN_PROTECTED_API_ROUTES_PREFIX
  );
  const token = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET ??
      process.env.AUTH_SECRET ??
      process.env.JWT_SECRET,
  });
  const isAdminRoute = pathname.startsWith(ADMIN_PROTECTED_ROUTES);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(DEFAULT_REDIRECT_ADMIN_ROUTE, request.url)
    );
  }

  if (isAdminRoute || isAdminApiRoute) {
    if (!token) {
      if (isAdminApiRoute) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(
        new URL(DEFAULT_REDIRECT_LOGIN_ROUTE, request.url)
      );
    }

    if (token.role !== "ADMIN") {
      if (isAdminApiRoute) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/admin/:path*", "/login", "/register"],
};
