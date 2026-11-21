
import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";
import { languageCreateSchema } from "@/app/admin/languages/_schema/language-schema";
import type { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";


// ==============================
// CREATE LANGUAGE
// ==============================
export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const formData = await req.formData();

    const payload = Object.fromEntries(
      formData.entries()
    );

    const parsed = languageCreateSchema.safeParse({
      name: payload.name,
      order: payload.order || 1,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid fields",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, order } = parsed.data;

    const image = formData.get("image");

    // Check duplicate language
    const existingLanguage = await prisma.language.findUnique({
      where: { name },
    });

    if (existingLanguage) {
      return error({
        status: 409,
        message: "Language already exists",
      });
    }

    let imagePath: string | null = null;

    if (image instanceof File && image.size > 0) {
      const uploaded = await uploadImage(image, "languages");
      imagePath = uploaded.path;
    }

    const language = await prisma.language.create({
      data: {
        name,
        order,
        image: imagePath,
      },
    });

    return success({
      message: "Language created successfully",
      data: withAbsoluteAssetUrls(language, req.url),
      status: 201,
    });

  } catch (err) {
    console.error("Create language error:", err);

    return error({
      status: 500,
      message: "Failed to create language",
    });
  }
}


// ==============================
// GET ALL LANGUAGES
// ==============================
export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pagination parameters",
        },
        { status: 400 }
      );
    }

    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return error({
        status: 400,
        message: "Page value is too large",
      });
    }

    const where: Prisma.LanguageWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.language.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
        include: {
          _count: {
            select: {
              projects: true,
            },
          },
        },
      }),

      prisma.language.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Languages fetched successfully",
        data: withAbsoluteAssetUrls(data, req.url),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Fetch languages error:", err);

    return error({
      status: 500,
      message: "Failed to fetch languages",
    });
  }
}
