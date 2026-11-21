
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { serviceCreateSchema } from "@/app/admin/services/_schema/service-schema";

import type { Prisma } from "@/generated/prisma/client";

// ==============================
// GET ALL SERVICES
// ==============================
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { searchParams } = new URL(request.url);

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

    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Page value is too large",
        },
        { status: 400 }
      );
    }

    const where: Prisma.ServicesWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.services.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      }),

      prisma.services.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Services fetched successfully",
        data: withAbsoluteAssetUrls(data, request.url),
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
    console.error("GET SERVICES:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}

// ==============================
// CREATE SERVICE
// ==============================
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const order = formData.get("order");
    const isActive = formData.get("isActive");
    const imageFile = formData.get("image");

    // Validate service fields
    const parsed = serviceCreateSchema.safeParse({
      title: typeof title === "string" ? title : "",
      description:
        typeof description === "string" ? description : "",
      order:
        typeof order === "string" && order.trim() !== ""
          ? order
          : 1,
      isActive: isActive ?? "true",
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

    // Validate image field
    if (
      imageFile !== null &&
      typeof imageFile !== "string" &&
      !(imageFile instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid image file",
        },
        { status: 400 }
      );
    }

    let imagePath: string | null = null;

    // Upload image
    if (imageFile instanceof File && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Only image files are allowed",
          },
          { status: 400 }
        );
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Image size must not exceed 5MB",
          },
          { status: 400 }
        );
      }

      const uploaded = await uploadImage(imageFile, "services");

      imagePath = uploaded.path;
    }

    // Create service
    const service = await prisma.services.create({
      data: {
        ...parsed.data,
        image: imagePath,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        data: withAbsoluteAssetUrls(service, request.url),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("CREATE SERVICE:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service",
      },
      { status: 500 }
    );
  }
}
