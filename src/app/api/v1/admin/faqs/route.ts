
import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { error, success } from "@/lib/api-response";
import { faqCreateSchema } from "@/app/admin/faqs/_schema/faq-schema";


// GET /api/v1/faqs?page=1&limit=10&search=
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1,
    );

    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );

    const search = searchParams.get("search")?.trim() || "";

    const where = search
      ? {
          OR: [
            {
              question: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              answer: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.fAQ.count({ where }),
    ]);

    return success({
      message: "FAQs fetched successfully",
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET FAQs error:", err);

    return error({
      status: 500,
      message: "Failed to fetch FAQs",
    });
  }
}

// POST /api/v1/admin/faqs
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();

    const parsed = faqCreateSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!parsed.success) {
      return error({
        status: 400,
        message: "Validation failed",
      });
    }

    const faq = await prisma.fAQ.create({
      data: parsed.data,
    });

    return success({
      status: 201,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (err) {
    console.error("POST FAQ error:", err);

    return error({
      status: 500,
      message: "Failed to create FAQ",
    });
  }
}
