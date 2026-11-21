
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { testimonialCreateSchema } from "@/app/admin/testimonials/_schema/testimonial-schema";

import type { Prisma } from "@/generated/prisma/client";

// ==============================
// GET ALL TESTIMONIALS
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
        { status: 400 },
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
        { status: 400 },
      );
    }

    const where: Prisma.TestimonialWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          position: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          testimonial: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      }),

      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Testimonials fetched successfully",
        data: withAbsoluteAssetUrls(testimonials, request.url),
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
    console.error("GET TESTIMONIALS:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonials",
      },
      { status: 500 },
    );
  }
}

// ==============================
// CREATE TESTIMONIAL
// ==============================
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const position = formData.get("position");
    const company = formData.get("company");
    const testimonial = formData.get("testimonial");
    const order = formData.get("order");
    const isActive = formData.get("isActive");
    const avatarFile = formData.get("avatar");

    // Validate testimonial fields
    const parsed = testimonialCreateSchema.safeParse({
      name: typeof name === "string" ? name : "",
      position: typeof position === "string" ? position : "",
      company: typeof company === "string" ? company : "",
      testimonial:
        typeof testimonial === "string" ? testimonial : "",
      order:
        typeof order === "string" && order.trim() !== ""
          ? order
          : 1,
      isActive:
        isActive === null
          ? "true"
          : typeof isActive === "string"
            ? isActive
            : "",
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

    // Validate avatar field
    if (
      avatarFile !== null &&
      typeof avatarFile !== "string" &&
      !(avatarFile instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid avatar file",
        },
        { status: 400 },
      );
    }

    let avatarPath: string | null = null;

    // Upload avatar
    if (avatarFile instanceof File && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Only image files are allowed",
          },
          { status: 400 },
        );
      }

      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Avatar size must not exceed 5MB",
          },
          { status: 400 },
        );
      }

      const uploaded = await uploadImage(
        avatarFile,
        "testimonials",
      );

      avatarPath = uploaded.path;
    }

    // Create testimonial
    const testimonialData = await prisma.testimonial.create({
      data: {
        ...parsed.data,
        avatar: avatarPath,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created successfully",
        data: withAbsoluteAssetUrls(
          testimonialData,
          request.url,
        ),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("CREATE TESTIMONIAL:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create testimonial",
      },
      { status: 500 },
    );
  }
}
