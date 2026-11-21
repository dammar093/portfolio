
import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { languageUpdateSchema } from "@/app/admin/languages/_schema/language-schema";

import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ==============================
// GET SINGLE LANGUAGE
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

    const language = await prisma.language.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!language) {
      return error({
        status: 404,
        message: "Language not found",
      });
    }

    const responseData = withAbsoluteAssetUrls(language, req.url);

    return success({
      message: "Language fetched successfully",
      data: {
        ...responseData,
        isActive: language.isActive,
      },
    });
  } catch (err) {
    console.error("Get language error:", err);

    return error({
      status: 500,
      message: "Failed to fetch language",
    });
  }
}

// ==============================
// UPDATE LANGUAGE
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

    const existingLanguage = await prisma.language.findUnique({
      where: { id },
    });

    if (!existingLanguage) {
      return error({
        status: 404,
        message: "Language not found",
      });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const order = formData.get("order");
    const isActive = formData.get("isActive");

    const parsed = languageUpdateSchema.safeParse({
      ...(name !== null && { name }),
      ...(order !== null && { order }),
      ...(isActive !== null && { isActive }),
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

    const {
      name: languageName,
      order: languageOrder,
      isActive: languageIsActive,
    } = parsed.data;

    // Check duplicate name
    if (
      languageName &&
      languageName !== existingLanguage.name
    ) {
      const duplicate = await prisma.language.findUnique({
        where: { name: languageName },
      });

      if (duplicate) {
        return error({
          status: 409,
          message: "Language name already exists",
        });
      }
    }

    // Keep existing image unless a new image is uploaded
    const image = formData.get("image");

    let imagePath = existingLanguage.image;

    if (image instanceof File && image.size > 0) {
      const uploaded = await uploadImage(image, "languages");
      imagePath = uploaded.path;
    }

    // Update language
    const language = await prisma.language.update({
      where: { id },
      data: {
        ...(languageName !== undefined && {
          name: languageName,
        }),

        ...(languageOrder !== undefined && {
          order: languageOrder,
        }),

        ...(languageIsActive !== undefined && {
          isActive: languageIsActive,
        }),

        image: imagePath,
      },
    });

    const responseData = withAbsoluteAssetUrls(language, req.url);

    return success({
      message: "Language updated successfully",
      data: {
        ...responseData,
        isActive: language.isActive,
      },
    });
  } catch (err) {
    console.error("Update language error:", err);

    return error({
      status: 500,
      message: "Failed to update language",
    });
  }
}

// ==============================
// DELETE LANGUAGE
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

    const language = await prisma.language.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!language) {
      return error({
        status: 404,
        message: "Language not found",
      });
    }

    // Prevent deletion if language is assigned to projects
    if (language._count.projects > 0) {
      return error({
        status: 400,
        message: `Cannot delete this language. It is assigned to ${language._count.projects} projects.`,
      });
    }

    await prisma.language.delete({
      where: { id },
    });

    return success({
      message: "Language deleted successfully",
    });
  } catch (err) {
    console.error("Delete language error:", err);

    return error({
      status: 500,
      message: "Failed to delete language",
    });
  }
}
