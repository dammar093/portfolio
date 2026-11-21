import { SeoType } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

import { projectCreateSchema } from "@/app/admin/projects/_schema/project-schema";

import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { NextRequest, NextResponse } from "next/server";

// =====================================
// CREATE PROJECT
// =====================================
export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  try {
    const formData = await req.formData();

    const payload: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    const languageIdsValue = formData.get("languageIds");

    if (languageIdsValue !== null) {
      payload.languageIds = String(languageIdsValue);
    }

    const parsed = projectCreateSchema.safeParse(payload);

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
      title,
      slug,
      description,
      link,
      order,
      isActive,
      languageIds,
    } = parsed.data;

    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return error({
        status: 400,
        message: "Project image is required",
      });
    }

    // Validate selected languages
    if (languageIds.length > 0) {
      const languages = await prisma.language.findMany({
        where: {
          id: { in: languageIds },
          isActive: true,
        },
        select: { id: true },
      });

      if (languages.length !== new Set(languageIds).size) {
        return error({
          status: 400,
          message: "One or more selected languages are invalid or inactive",
        });
      }
    }

    const upload = await uploadImage(image, "projects");
    const imagePath = upload.path;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        link,
        order,
        isActive,
        image: imagePath,

        languages: {
          create: languageIds.map((languageId) => ({
            language: {
              connect: { id: languageId },
            },
          })),
        },

        seo: {
          create: {
            og_ttile: title,
            slug,
            og_description: description.slice(0, 160),
            og_image: imagePath,
            seo_type: SeoType.PROJECT,
          },
        },
      },
      include: {
        seo: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return success({
      message: "Project created successfully",
      data: withAbsoluteAssetUrls(project, req.url),
      status: 201,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return error({
        status: 409,
        message: "A project or SEO record with this slug already exists",
      });
    }

    return error({
      status: 500,
      message: "Failed to create project",
    });
  }
}

// =====================================
// FETCH PROJECTS
// =====================================
export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search")?.trim() ?? "";

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return error({
        status: 400,
        message: "Invalid pagination parameters",
      });
    }

    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return error({
        status: 400,
        message: "Page value is too large",
      });
    }

    const where: Prisma.ProjectWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { link: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total, usedSlugs] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        include: {
          seo: true,
          languages: {
            include: {
              language: true,
            },
          },
        },
      }),

      prisma.project.count({ where }),

      prisma.project.findMany({
        select: { slug: true },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Projects fetched successfully",
        data: withAbsoluteAssetUrls(data, req.url),
        usedSlugs: usedSlugs.map((item) => item.slug),
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
    console.error("FETCH PROJECTS ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch projects",
    });
  }
}