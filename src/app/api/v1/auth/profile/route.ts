import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(80) });

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Name must be between 2 and 80 characters" }, { status: 400 });
  const userId = auth.session?.user?.id;
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.update({ where: { id: userId }, data: { name: parsed.data.name }, select: { id: true, name: true, email: true } });
  return NextResponse.json({ message: "Account details updated", user });
}
