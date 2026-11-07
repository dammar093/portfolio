import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";
import { pageUpdateSchema } from "@/app/admin/pages/_schema/page-schema";
import { NextRequest } from "next/server";

type PageRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: PageRouteContext) {
  const authCheck = await requireAdmin();
  if (!authCheck.ok) {
    return authCheck.response;
  }

  const { id: idOrSlug } = await context.params;

  try {
    const existingPage = await prisma.page.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!existingPage) {
      return error({ status: 404, message: "Page not found" });
    }

    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    const parsed = pageUpdateSchema.safeParse({
      ...payload,
    });

    if (!parsed.success) {
      return error({
        status: 400,
        message: "Invalid fields",
      });
    }

    const pageData = {
      title: parsed.data.title,
      short_title: parsed.data.short_title,
      description: parsed.data.description,
    };
    let imagePath = existingPage.image;
    const image = formData.get("image");

    if (image instanceof File) {
      const upload = await uploadImage(image, "pages");
      imagePath = upload.path;
    }
    const page = await prisma.page.update({
      where: { id: existingPage.id },
      data: {
        ...pageData,
        image: imagePath,
      },
    });

    return success({
      message: "Page updated successfully",
      data: withAbsoluteAssetUrls(page, req.url),
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return error({ status: 500, message: "Something went wrong" });
  }
}

export async function GET(
  req: NextRequest,
  context: PageRouteContext,
) {
  const authCheck = await requireAdmin();
  if (!authCheck.ok) {
    return authCheck.response;
  }

  const { id: idOrSlug } = await context.params;

  try {
    const page = await prisma.page.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!page) {
      return error(
        {
          status: 404,
          message: "Page not found",
        },
      );
    }

    return success(
      {
        status: 200,
        message: "Page fetched successfully",
        data: withAbsoluteAssetUrls(page, req.url),
      },

    );
  } catch (err) {
    console.error(err);
    return error(
      {
        status: 500,
        message: "Something went wrong",
      },
    );
  }
}

/**
 * @swagger
 * /pages/{id}:
 *   delete:
 *     tags: [Admin Pages]
 *     summary: Delete a page
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Page ID
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest, context: PageRouteContext) {
  const authCheck = await requireAdmin();
  if (!authCheck.ok) {
    return authCheck.response;
  }

  const { id } = await context.params;

  try {
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return error(
        {
          status: 404,
          message: "Page not found",
        },
      );
    }

    const page = await prisma.page.delete({
      where: { id },
    });

    // ❌ SEO is intentionally NOT deleted/updated

    return success(
      {
        status: 200,
        message: "Page delete successfully",
        data: page
      },
    );
  } catch (err) {
    console.error(err);
    return error(
      {
        status: 500,
        message: "Something went wrong",
      },
    );
  }
}