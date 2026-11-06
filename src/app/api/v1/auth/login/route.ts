import { authOptions } from "@/auth";
import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

const nextAuthHandler = NextAuth(authOptions);

export async function POST(request: NextRequest) {
  const response = await nextAuthHandler(request, {
    params: { nextauth: ["callback", "credentials"] },
  });
  const result = (await response.json()) as { url?: string; message?: string };
  const redirectUrl = result.url
    ? new URL(result.url, request.url)
    : undefined;

  if (redirectUrl?.searchParams.has("error")) {
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

  return NextResponse.json(
    { message: "Login successful", redirectTo: redirectUrl.toString() },
    { status: response.status, headers: response.headers }
  );
}
