import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Forbidden: Admin only" },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    session,
  };
}
