
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { testimonialUpdateSchema } from "@/app/admin/testimonials/_schema/testimonial-schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ==============================
// GET SINGLE TESTIMONIAL
// ==============================
export async function GET(
  req: NextRequest,
  { params }: RouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return error({
        status: 404,
        message: "Testimonial not found",
      });
    }

    return success({
      message: "Testimonial fetched successfully",
      data: withAbsoluteAssetUrls(testimonial, req.url),
    });
  } catch (err) {
    console.error("GET TESTIMONIAL:", err);

    return error({
      status: 500,
      message: "Failed to fetch testimonial",
    });
  }
}

// ==============================
// UPDATE TESTIMONIAL
// ==============================
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const existingTestimonial =
      await prisma.testimonial.findUnique({
        where: { id },
      });

    if (!existingTestimonial) {
      return error({
        status: 404,
        message: "Testimonial not found",
      });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const position = formData.get("position");
    const company = formData.get("company");
    const testimonial = formData.get("testimonial");
    const order = formData.get("order");
    const isActive = formData.get("isActive");
    const avatarFile = formData.get("avatar");

    // Validate provided fields
    const parsed = testimonialUpdateSchema.safeParse({
      ...(name !== null && {
        name: typeof name === "string" ? name : "",
      }),

      ...(position !== null && {
        position: typeof position === "string" ? position : "",
      }),

      ...(company !== null && {
        company: typeof company === "string" ? company : "",
      }),

      ...(testimonial !== null && {
        testimonial:
          typeof testimonial === "string" ? testimonial : "",
      }),

      ...(order !== null && {
        order: typeof order === "string" ? order : "",
      }),

      ...(isActive !== null && {
        isActive:
          typeof isActive === "string" ? isActive : "",
      }),
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
      return error({
        status: 400,
        message: "Invalid avatar file",
      });
    }

    // Keep existing avatar by default
    let avatarPath = existingTestimonial.avatar;

    // Upload new avatar if provided
    if (avatarFile instanceof File && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        return error({
          status: 400,
          message: "Only image files are allowed",
        });
      }

      if (avatarFile.size > 5 * 1024 * 1024) {
        return error({
          status: 400,
          message: "Avatar size must not exceed 5MB",
        });
      }

      const uploaded = await uploadImage(
        avatarFile,
        "testimonials",
      );

      avatarPath = uploaded.path;
    }

    // Update testimonial
    const updatedTestimonial =
      await prisma.testimonial.update({
        where: { id },
        data: {
          ...parsed.data,
          avatar: avatarPath,
        },
      });

    return success({
      message: "Testimonial updated successfully",
      data: withAbsoluteAssetUrls(
        updatedTestimonial,
        req.url,
      ),
    });
  } catch (err) {
    console.error("UPDATE TESTIMONIAL:", err);

    return error({
      status: 500,
      message: "Failed to update testimonial",
    });
  }
}

// ==============================
// DELETE TESTIMONIAL
// ==============================
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const existingTestimonial =
      await prisma.testimonial.findUnique({
        where: { id },
      });

    if (!existingTestimonial) {
      return error({
        status: 404,
        message: "Testimonial not found",
      });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return success({
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    console.error("DELETE TESTIMONIAL:", err);

    return error({
      status: 500,
      message: "Failed to delete testimonial",
    });
  }
}
