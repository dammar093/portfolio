
import { serviceCreateSchema } from "@/app/admin/services/_schema/service-schema";

import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { NextRequest, NextResponse } from "next/server";

type ServiceRouteContext = {
  params: Promise<{ id: string }>;
};

// =====================================
// GET SERVICE
// =====================================
export async function GET(req: NextRequest, context: ServiceRouteContext) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id } = await context.params;

  try {
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
      status: 200,
      message: "Service fetched successfully",
      data: withAbsoluteAssetUrls(service, req.url),
    });
  } catch (err) {
    console.error("FETCH SERVICE ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch service",
    });
  }
}

// =====================================
// UPDATE SERVICE
// =====================================
export async function PATCH(req: NextRequest, context: ServiceRouteContext) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id } = await context.params;

  try {
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

    const payload: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    const parsed = serviceCreateSchema.safeParse({
      title: payload.title ?? existingService.title,
      description: payload.description ?? existingService.description,
      order: payload.order ?? existingService.order,
      isActive: payload.isActive ?? existingService.isActive,
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

    const { title, description, order, isActive } = parsed.data;

    const image = formData.get("image");

    let imagePath = existingService.image;

    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return error({
          status: 400,
          message: "Only image files are allowed",
        });
      }

      if (image.size > 5 * 1024 * 1024) {
        return error({
          status: 400,
          message: "Image size must not exceed 5MB",
        });
      }

      const upload = await uploadImage(image, "services");
      imagePath = upload.path;
    }

    const service = await prisma.services.update({
      where: { id: existingService.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(imagePath !== existingService.image && {
          image: imagePath,
        }),
      },
    });

    return success({
      status: 200,
      message: "Service updated successfully",
      data: withAbsoluteAssetUrls(service, req.url),
    });
  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);

    return error({
      status: 500,
      message: "Failed to update service",
    });
  }
}

// =====================================
// DELETE SERVICE
// =====================================
export async function DELETE(
  _req: NextRequest,
  context: ServiceRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id } = await context.params;

  try {
    const existingService = await prisma.services.findUnique({
      where: { id },
    });

    if (!existingService) {
      return error({
        status: 404,
        message: "Service not found",
      });
    }

    const service = await prisma.services.delete({
      where: { id: existingService.id },
    });

    return success({
      status: 200,
      message: "Service deleted successfully",
      data: service,
    });
  } catch (err) {
    console.error("DELETE SERVICE ERROR:", err);

    return error({
      status: 500,
      message: "Failed to delete service",
    });
  }
}
