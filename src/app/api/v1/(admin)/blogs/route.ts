
import { SeoType } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

import { blogCreateSchema } from "@/app/admin/blogs/_schema/blog-schema";
import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const formData = await req.formData();

    const payload = Object.fromEntries(formData.entries());

    const parsed = blogCreateSchema.safeParse({
      ...payload,
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

    const { title, slug, description, isActive } = parsed.data;

    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return error({
        status: 400,
        message: "Blog image is required",
      });
    }

    // Upload image
    const { path } = await uploadImage(image, "blogs");

    // Create blog and SEO together
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        description,
        image: path,
        isActive,

        seo: {
          create: {
            og_ttile: title,
            slug,
            og_description: description.slice(0, 160),
            og_image: path,
            seo_type: SeoType.BLOG,
          },
        },
      },
      include: {
        seo: true,
      },
    });

    return success({
      message: "Blog created successfully",
      data: withAbsoluteAssetUrls(blog, req.url),
      status: 201,
    });
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);

    // Unique slug conflict
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return error({
        status: 409,
        message: "A blog with this slug already exists",
      });
    }

    return error({
      status: 500,
      message: "Something went wrong",
    });
  }
}

// Fetch blogs with pagination and search
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
          message:
            "Page must be a positive integer and limit must be between 1 and 100",
        },
        { status: 400 },
      );
    }

    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Page value is too large",
        },
        { status: 400 },
      );
    }

    // Search filters
    const where: Prisma.BlogWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [data, total, usedSlugs] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          seo: true,
        },
      }),

      prisma.blog.count({ where }),

      prisma.blog.findMany({
        select: {
          slug: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Blogs fetched successfully",
        data: withAbsoluteAssetUrls(data, req.url),
        usedSlugs: usedSlugs.map(({ slug }) => slug),
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
    console.error("FETCH BLOGS ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
      },
      { status: 500 },
    );
  }
}
