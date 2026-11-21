
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { serviceUpdateSchema } from "@/app/admin/services/_schema/service-schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ==============================
// GET SINGLE SERVICE
// ==============================
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const service = await prisma.services.findUnique({
      where: { id },
    });

    if (!service) {
      return error({
        status: 404,
        message: "Service not found",
      });
    }

    return success({
      message: "Service fetched successfully",
      data: withAbsoluteAssetUrls(service, req.url),
    });
  } catch (err) {
    console.error("GET SERVICE:", err);

    return error({
      status: 500,
      message: "Failed to fetch service",
    });
  }
}

// ==============================
// UPDATE SERVICE
// ==============================
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const existingService = await prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      return error({
        status: 404,
        message: "Service not found",
      });
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const order = formData.get("order");
    const imageFile = formData.get("image");

    // Validate fields
    const parsed = serviceUpdateSchema.safeParse({
      ...(title !== null && {
        title: typeof title === "string" ? title : "",
      }),
      ...(description !== null && {
        description:
          typeof description === "string" ? description : "",
      }),
      ...(order !== null && {
        order: typeof order === "string" ? order : "",
      }),
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
      return error({
        status: 400,
        message: "Invalid image file",
      });
    }

    // Keep existing image by default
    let imagePath: string | null = existingService.image;

    // Upload new image if provided
    if (imageFile instanceof File && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        return error({
          status: 400,
          message: "Only image files are allowed",
        });
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return error({
          status: 400,
          message: "Image size must not exceed 5MB",
        });
      }

      const uploaded = await uploadImage(
        imageFile,
        "services"
      );

      // Save image path, not the complete upload object
      imagePath = uploaded.path;
    }

    // Update service
    const service = await prisma.services.update({
      where: { id },
      data: {
        ...parsed.data,
        image: imagePath,
      },
    });

    return success({
      message: "Service updated successfully",
      data: withAbsoluteAssetUrls(service, req.url),
    });
  } catch (err) {
    console.error("UPDATE SERVICE:", err);

    return error({
      status: 500,
      message: "Failed to update service",
    });
  }
}

// ==============================
// DELETE SERVICE
// ==============================
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    const existingService = await prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      return error({
        status: 404,
        message: "Service not found",
      });
    }

    await prisma.services.delete({
      where: { id },
    });

    return success({
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error("DELETE SERVICE:", err);

    return error({
      status: 500,
      message: "Failed to delete service",
    });
  }
}
