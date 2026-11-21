
import { NextRequest, NextResponse } from "next/server";

import { contactQuerySchema } from "@/app/admin/contacts/_schema/contact-schema";

import { error } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// =====================================
// GET ALL CONTACTS
// =====================================
export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  try {
    const { searchParams } = new URL(req.url);

    // =====================================
    // VALIDATE QUERY PARAMETERS
    // =====================================
    const parsed = contactQuerySchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
      search: searchParams.get("search") ?? "",
      isSeen: searchParams.get("isSeen") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { page, limit, search, isSeen } = parsed.data;

    const skip = (page - 1) * limit;

    // =====================================
    // WHERE CONDITIONS
    // =====================================
    const where = {
      ...(search && {
        OR: [
          {
            fullname: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            forWhat: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            message: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

      ...(isSeen !== undefined && {
        isSeen: isSeen === "true",
      }),
    };

    // =====================================
    // FETCH CONTACTS AND COUNTS
    // =====================================
    const [data, total, unseenCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.contact.count({
        where,
      }),

      prisma.contact.count({
        where: {
          isSeen: false,
        },
      }),
    ]);

    // =====================================
    // RESPONSE
    // =====================================
    return NextResponse.json(
      {
        success: true,
        message: "Contacts fetched successfully",
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        unseenCount,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("FETCH CONTACTS ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch contacts",
    });
  }
}
