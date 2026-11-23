import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { hashedPassword } from "@/utils/hash-password";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(128), confirmPassword: z.string() }).refine((data) => data.newPassword === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Check the password fields" }, { status: 400 });
  const userId = auth.session?.user?.id;
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.password || !(await bcrypt.compare(parsed.data.currentPassword, user.password))) return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
  await prisma.user.update({ where: { id: user.id }, data: { password: await hashedPassword(parsed.data.newPassword) } });
  return NextResponse.json({ message: "Password changed successfully" });
}
