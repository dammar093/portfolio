
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";
import { serializeExperience } from "@/lib/experience-serializer";

import { experienceCreateSchema } from "@/app/admin/experiences/_schema/experience-schema";

import type { Prisma } from "@/generated/prisma/client";

// ==============================
// CONSTANTS
// ==============================

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// ==============================
// HELPERS
// ==============================

function jsonError(
  message: string,
  status = 400,
  errors?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
}

function validateImage(file: FormDataEntryValue | null) {
  if (file === null || file === "") {
    return { valid: true, file: null as File | null };
  }

  if (!(file instanceof File)) {
    return { valid: false, file: null };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, file: null };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, file: null };
  }

  return { valid: true, file };
}

function parseBoolean(value: FormDataEntryValue | null, fallback: boolean) {
  if (value === null) return fallback;
  return value === "true";
}

// ==============================
// GET ALL EXPERIENCES
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
      return jsonError("Invalid pagination parameters");
    }

    const search = searchParams.get("search")?.trim() ?? "";
    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return jsonError("Page value is too large");
    }

    const where: Prisma.ExperienceWhereInput = search
      ? {
          OR: [
            {
              company: {
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
              location: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { order: "asc" },
          { joinDate: "desc" },
        ],
      }),

      prisma.experience.count({ where }),
    ]);

    // Serialize Date objects BEFORE processing asset URLs.
    const serializedData = experiences.map(serializeExperience);

    const data = withAbsoluteAssetUrls(
      serializedData,
      request.url
    );

    return NextResponse.json(
      {
        success: true,
        message: "Experiences fetched successfully",
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET EXPERIENCES:", error);

    return jsonError("Failed to fetch experiences", 500);
  }
}

// ==============================
// CREATE EXPERIENCE
// ==============================

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const formData = await request.formData();

    const imageFile = formData.get("image");

    const joinDate = formData.get("joinDate");
    const leaveDate = formData.get("leaveDate");

    const parsed = experienceCreateSchema.safeParse({
      company: formData.get("company") ?? "",
      position: formData.get("position") ?? "",
      employmentType: formData.get("employmentType") ?? "",
      location: formData.get("location") ?? "",
      description: formData.get("description") ?? "",

      // Date-only values are normalized to UTC midnight.
      joinDate:
        typeof joinDate === "string" && joinDate.trim()
          ? `${joinDate.slice(0, 10)}T00:00:00.000Z`
          : "",

      leaveDate:
        typeof leaveDate === "string" && leaveDate.trim()
          ? `${leaveDate.slice(0, 10)}T00:00:00.000Z`
          : null,

      isCurrent: parseBoolean(formData.get("isCurrent"), false),

      order: formData.get("order") || 1,

      isActive: parseBoolean(formData.get("isActive"), true),
    });

    if (!parsed.success) {
      return jsonError(
        "Invalid experience fields",
        400,
        parsed.error.flatten()
      );
    }

    const imageValidation = validateImage(imageFile);

    if (!imageValidation.valid) {
      return jsonError(
        "Invalid image. Only PNG, JPG, and WEBP images up to 5MB are allowed."
      );
    }

    let imagePath: string | null = null;

    if (imageValidation.file) {
      const uploaded = await uploadImage(
        imageValidation.file,
        "experiences"
      );

      imagePath = uploaded.path;
    }

    const experience = await prisma.experience.create({
      data: {
        company: parsed.data.company,
        position: parsed.data.position,
        employmentType: parsed.data.employmentType,
        location: parsed.data.location || null,
        description: parsed.data.description,

        joinDate: parsed.data.joinDate,
        leaveDate: parsed.data.isCurrent
          ? null
          : parsed.data.leaveDate ?? null,

        isCurrent: parsed.data.isCurrent,
        order: parsed.data.order,
        isActive: parsed.data.isActive,
        image: imagePath,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Experience created successfully",
        data: withAbsoluteAssetUrls(
          serializeExperience(experience),
          request.url
        ),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE EXPERIENCE:", error);

    return jsonError("Failed to create experience", 500);
  }
}
