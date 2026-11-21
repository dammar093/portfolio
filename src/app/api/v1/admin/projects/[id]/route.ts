import { SeoType } from "@/generated/prisma/enums";

import { projectUpdateSchema } from "@/app/admin/projects/_schema/project-schema";

import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { NextRequest, NextResponse } from "next/server";

type ProjectRouteContext = {
  params: Promise<{ id: string }>;
};

// =====================================
// GET PROJECT
// =====================================
export async function GET(
  req: NextRequest,
  context: ProjectRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id: idOrSlug } = await context.params;

  try {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        seo: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    if (!project) {
      return error({
        status: 404,
        message: "Project not found",
      });
    }

    return success({
      status: 200,
      message: "Project fetched successfully",
      data: withAbsoluteAssetUrls(project, req.url),
    });
  } catch (err) {
    console.error("FETCH PROJECT ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch project",
    });
  }
}

// =====================================
// UPDATE PROJECT
// =====================================
export async function PATCH(
  req: NextRequest,
  context: ProjectRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id: idOrSlug } = await context.params;

  try {
    const existingProject = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        seo: true,
      },
    });

    if (!existingProject) {
      return error({
        status: 404,
        message: "Project not found",
      });
    }

    const formData = await req.formData();

    const payload: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    const languageIdsValue = formData.get("languageIds");

    if (languageIdsValue !== null) {
      payload.languageIds = String(languageIdsValue);
    }

    const parsed = projectUpdateSchema.safeParse(payload);

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
      title,
      slug,
      description,
      link,
      order,
      isActive,
      languageIds,
    } = parsed.data;

    if (languageIds !== undefined && languageIds.length > 0) {
      const languages = await prisma.language.findMany({
        where: {
          id: { in: languageIds },
          isActive: true,
        },
        select: { id: true },
      });

      if (languages.length !== new Set(languageIds).size) {
        return error({
          status: 400,
          message: "One or more selected languages are invalid or inactive",
        });
      }
    }

    const image = formData.get("image");

    let imagePath = existingProject.image;

    if (image instanceof File && image.size > 0) {
      const upload = await uploadImage(image, "projects");
      imagePath = upload.path;
    }

    const updatedTitle = title ?? existingProject.title;
    const updatedSlug = slug ?? existingProject.slug;
    const updatedDescription = description ?? existingProject.description;

    const project = await prisma.project.update({
      where: { id: existingProject.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(link !== undefined && { link }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(imagePath !== existingProject.image && { image: imagePath }),

        ...(languageIds !== undefined && {
          languages: {
            deleteMany: {},
            create: languageIds.map((languageId) => ({
              language: {
                connect: { id: languageId },
              },
            })),
          },
        }),

        seo: {
          upsert: {
            create: {
              og_ttile: updatedTitle,
              slug: updatedSlug,
              og_description: updatedDescription.slice(0, 160),
              og_image: imagePath,
              seo_type: SeoType.PROJECT,
            },
            update: {
              og_ttile: updatedTitle,
              slug: updatedSlug,
              og_description: updatedDescription.slice(0, 160),
              og_image: imagePath,
              seo_type: SeoType.PROJECT,
            },
          },
        },
      },
      include: {
        seo: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });

    return success({
      status: 200,
      message: "Project updated successfully",
      data: withAbsoluteAssetUrls(project, req.url),
    });
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return error({
        status: 409,
        message: "A project or SEO record with this slug already exists",
      });
    }

    return error({
      status: 500,
      message: "Failed to update project",
    });
  }
}

// =====================================
// DELETE PROJECT
// =====================================
export async function DELETE(
  _req: NextRequest,
  context: ProjectRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id: idOrSlug } = await context.params;

  try {
    const existingProject = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!existingProject) {
      return error({
        status: 404,
        message: "Project not found",
      });
    }

    const project = await prisma.project.delete({
      where: { id: existingProject.id },
    });

    return success({
      status: 200,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);

    return error({
      status: 500,
      message: "Failed to delete project",
    });
  }
}