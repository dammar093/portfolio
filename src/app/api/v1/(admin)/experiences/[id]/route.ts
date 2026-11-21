
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";
import { serializeExperience } from "@/lib/experience-serializer";

import { experienceUpdateSchema } from "@/app/admin/experiences/_schema/experience-schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

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

function parseDateInput(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const datePart = value.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return null;
  }

  const date = new Date(`${datePart}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== datePart
  ) {
    return null;
  }

  return date;
}

// ==============================
// GET SINGLE EXPERIENCE
// ==============================

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return jsonError("Experience not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Experience fetched successfully",
        data: withAbsoluteAssetUrls(
          serializeExperience(experience),
          request.url
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET EXPERIENCE:", error);

    return jsonError("Failed to fetch experience", 500);
  }
}

// ==============================
// UPDATE EXPERIENCE
// ==============================

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const existingExperience =
      await prisma.experience.findUnique({
        where: { id },
      });

    if (!existingExperience) {
      return jsonError("Experience not found", 404);
    }

    const formData = await request.formData();

    const company = formData.get("company");
    const position = formData.get("position");
    const employmentType = formData.get("employmentType");
    const location = formData.get("location");
    const description = formData.get("description");

    const joinDateInput = formData.get("joinDate");
    const leaveDateInput = formData.get("leaveDate");

    const isCurrentInput = formData.get("isCurrent");
    const order = formData.get("order");
    const isActive = formData.get("isActive");
    const imageFile = formData.get("image");

    // ==============================
    // BUILD PARTIAL PAYLOAD
    // ==============================

    const payload: Record<string, unknown> = {};

    if (company !== null) {
      payload.company = company;
    }

    if (position !== null) {
      payload.position = position;
    }

    if (employmentType !== null) {
      payload.employmentType = employmentType;
    }

    if (location !== null) {
      payload.location = location;
    }

    if (description !== null) {
      payload.description = description;
    }

    if (joinDateInput !== null) {
      const date = parseDateInput(joinDateInput);

      if (!date) {
        return jsonError("Please provide a valid joining date");
      }

      payload.joinDate = date;
    }

    if (leaveDateInput !== null) {
      if (
        typeof leaveDateInput === "string" &&
        !leaveDateInput.trim()
      ) {
        payload.leaveDate = null;
      } else {
        const date = parseDateInput(leaveDateInput);

        if (!date) {
          return jsonError("Please provide a valid leaving date");
        }

        payload.leaveDate = date;
      }
    }

    if (isCurrentInput !== null) {
      if (
        isCurrentInput !== "true" &&
        isCurrentInput !== "false"
      ) {
        return jsonError("Invalid current employment value");
      }

      payload.isCurrent = isCurrentInput === "true";
    }

    if (order !== null) {
      payload.order = order;
    }

    if (isActive !== null) {
      payload.isActive = isActive === "true";
    }

    // ==============================
    // VALIDATE PARTIAL PAYLOAD
    // ==============================

    const parsed = experienceUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError(
        "Invalid experience fields",
        400,
        parsed.error.flatten()
      );
    }

    // ==============================
    // VALIDATE MERGED DATES
    // ==============================

    const finalJoinDate =
      parsed.data.joinDate ?? existingExperience.joinDate;

    const finalIsCurrent =
      parsed.data.isCurrent ?? existingExperience.isCurrent;

    let finalLeaveDate =
      parsed.data.leaveDate !== undefined
        ? parsed.data.leaveDate
        : existingExperience.leaveDate;

    if (finalIsCurrent) {
      finalLeaveDate = null;
    } else {
      if (!finalLeaveDate) {
        return jsonError(
          "Leaving date is required for past experience"
        );
      }

      if (finalLeaveDate < finalJoinDate) {
        return jsonError(
          "Leaving date cannot be before joining date"
        );
      }
    }

    // ==============================
    // VALIDATE IMAGE
    // ==============================

    let imagePath = existingExperience.image;

    if (imageFile !== null && imageFile !== "") {
      if (!(imageFile instanceof File)) {
        return jsonError("Invalid image file");
      }

      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        return jsonError(
          "Only JPEG, PNG, and WEBP images are allowed"
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return jsonError(
          "Image size must not exceed 5MB"
        );
      }

      const uploaded = await uploadImage(
        imageFile,
        "experiences"
      );

      imagePath = uploaded.path;
    }

    // ==============================
    // UPDATE EXPERIENCE
    // ==============================

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...(parsed.data.company !== undefined && {
          company: parsed.data.company,
        }),

        ...(parsed.data.position !== undefined && {
          position: parsed.data.position,
        }),

        ...(parsed.data.employmentType !== undefined && {
          employmentType: parsed.data.employmentType,
        }),

        ...(parsed.data.location !== undefined && {
          location: parsed.data.location || null,
        }),

        ...(parsed.data.description !== undefined && {
          description: parsed.data.description,
        }),

        joinDate: finalJoinDate,
        leaveDate: finalLeaveDate,
        isCurrent: finalIsCurrent,

        ...(parsed.data.order !== undefined && {
          order: parsed.data.order,
        }),

        ...(parsed.data.isActive !== undefined && {
          isActive: parsed.data.isActive,
        }),

        image: imagePath,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Experience updated successfully",
        data: withAbsoluteAssetUrls(
          serializeExperience(experience),
          request.url
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE EXPERIENCE:", error);

    return jsonError("Failed to update experience", 500);
  }
}

// ==============================
// DELETE EXPERIENCE
// ==============================

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const existingExperience =
      await prisma.experience.findUnique({
        where: { id },
      });

    if (!existingExperience) {
      return jsonError("Experience not found", 404);
    }

    await prisma.experience.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Experience deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE EXPERIENCE:", error);

    return jsonError("Failed to delete experience", 500);
  }
}
