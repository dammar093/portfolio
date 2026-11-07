import { SeoType } from "@/generated/prisma/enums";
import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { pageCreateSchema } from "@/app/admin/pages/_schema/page-schema";
import type { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const formData = await req.formData();
    // console.log("Forma Data:: ", formData)w
    // Convert FormData → plain object
    const payload = Object.fromEntries(formData.entries());
    // console.log("Payload:: ", payload)
    const parsed = pageCreateSchema.safeParse({
      ...payload,
      order: Number(payload.order),
      isMenu: payload.isMenu === "true",
      isFooter: payload.isFooter === "true",
      status: payload.status === "true",
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

    const { title } = parsed.data;

    const image = formData.get("image");

    if (!title || !(image instanceof File)) {
      return error({ status: 400, message: "Title and image are required" });
    }

    // ✅ Upload image
    const { path } = await uploadImage(image, "pages");
    const page = await prisma.page.create({
      data: {
        title: parsed.data.title,
        short_title: parsed.data.short_title,
        description: parsed.data.description,
        slug: parsed.data.slug,
        order: parsed.data.order,
        image: path,
      },
    });
    if (page) {
      await prisma.seo.create({
        data: {
          og_ttile: page?.title,
          slug: page?.slug,
          og_image: page.image,
          og_description: Array.from(page.description)
            .slice(0, 160)
            .join(""),
          seo_type: SeoType.PAGE,
          page_id: page?.id,
        },
      });
    }

    return success({
      message: "Page created successfully",
      data: page,
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return error({ status: 500, message: "Something went wrong" });
  }
}

// fetch pages
export async function GET(req: NextRequest) {
  // 🔒 Auth + Role
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
          message: "Page must be a positive integer and limit must be between 1 and 100",
        },
        { status: 400 },
      );
    }

    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      return NextResponse.json(
        { success: false, message: "Page value is too large" },
        { status: 400 },
      );
    }

    // 🔍 Filters
    const where: Prisma.PageWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { short_title: { contains: search } },
      ];
    }

    // 📊 Queries (data + total must use SAME filter)
    const [data, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Pages fetched successfully",
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
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pages",
      },
      { status: 500 },
    );
  }
}
