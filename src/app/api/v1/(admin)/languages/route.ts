
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

    const name = formData.get("name");
    const order = formData.get("order");
    const isActive = formData.get("isActive");

    const parsed = languageCreateSchema.safeParse({
      name,
      order: order || 1,
      ...(isActive !== null && { isActive }),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid fields",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      name: languageName,
      order: languageOrder,
      isActive: languageIsActive,
    } = parsed.data;

    // Check duplicate language
    const existingLanguage = await prisma.language.findUnique({
      where: { name: languageName },
    });

    if (existingLanguage) {
      return error({
        status: 409,
        message: "Language already exists",
      });
    }

    // Upload image
    const image = formData.get("image");

    let imagePath: string | null = null;

    if (image instanceof File && image.size > 0) {
      const uploaded = await uploadImage(image, "languages");
      imagePath = uploaded.path;
    }

    // Create language
    const language = await prisma.language.create({
      data: {
        name: languageName,
        order: languageOrder,
        isActive: languageIsActive,
        image: imagePath,
      },
    });

    const responseData = withAbsoluteAssetUrls(language, req.url);

    return success({
      message: "Language created successfully",
      data: {
        ...responseData,
        isActive: language.isActive,
      },
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
        { status: 400 },
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

    const [languages, total] = await Promise.all([
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

    // Explicitly preserve isActive after processing image URLs
    const data = languages.map((language) => ({
      ...withAbsoluteAssetUrls(language, req.url),
      isActive: language.isActive,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Languages fetched successfully",
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Fetch languages error:", err);

    return error({
      status: 500,
      message: "Failed to fetch languages",
    });
  }
}
