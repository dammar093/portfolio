
import { SeoType } from "@/generated/prisma/enums";

import { blogUpdateSchema } from "@/app/admin/blogs/_schema/blog-schema";
import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/upload-image";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

import { NextRequest } from "next/server";

type BlogRouteContext = {
  params: Promise<{ id: string }>;
};

// GET BLOG
export async function GET(
  req: NextRequest,
  context: BlogRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  const { id: idOrSlug } = await context.params;

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        seo: true,
      },
    });

    if (!blog) {
      return error({
        status: 404,
        message: "Blog not found",
      });
    }

    return success({
      status: 200,
      message: "Blog fetched successfully",
      data: withAbsoluteAssetUrls(blog, req.url),
    });
  } catch (err) {
    console.error("FETCH BLOG ERROR:", err);

    return error({
      status: 500,
      message: "Something went wrong",
    });
  }
}

// UPDATE BLOG
export async function PATCH(
  req: NextRequest,
  context: BlogRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  const { id: idOrSlug } = await context.params;

  try {
    const existingBlog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        seo: true,
      },
    });

    if (!existingBlog) {
      return error({
        status: 404,
        message: "Blog not found",
      });
    }

    const formData = await req.formData();

    const payload = Object.fromEntries(formData.entries());

    const parsed = blogUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return error({
        status: 400,
        message: "Invalid fields",
      });
    }

    const image = formData.get("image");

    let imagePath = existingBlog.image;

    if (image instanceof File && image.size > 0) {
      const upload = await uploadImage(image, "blogs");
      imagePath = upload.path;
    }

    // Preserve fields that were not submitted
    const title = parsed.data.title ?? existingBlog.title;
    const slug = parsed.data.slug ?? existingBlog.slug;
    const description =
      parsed.data.description ?? existingBlog.description;
    const isActive =
      parsed.data.isActive ?? existingBlog.isActive;

    const blog = await prisma.blog.update({
      where: {
        id: existingBlog.id,
      },
      data: {
        title,
        slug,
        description,
        image: imagePath,
        isActive,

        // Keep the related SEO record synchronized
        seo: {
          upsert: {
            create: {
              og_ttile: title,
              slug,
              og_description: description.slice(0, 160),
              og_image: imagePath,
              seo_type: SeoType.BLOG,
            },
            update: {
              og_ttile: title,
              slug,
              og_description: description.slice(0, 160),
              og_image: imagePath,
              seo_type: SeoType.BLOG,
            },
          },
        },
      },
      include: {
        seo: true,
      },
    });

    return success({
      message: "Blog updated successfully",
      data: withAbsoluteAssetUrls(blog, req.url),
      status: 200,
    });
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return error({
        status: 409,
        message: "A blog with this slug already exists",
      });
    }

    return error({
      status: 500,
      message: "Something went wrong",
    });
  }
}

// DELETE BLOG
export async function DELETE(
  req: NextRequest,
  context: BlogRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  const { id: idOrSlug } = await context.params;

  try {
    const existingBlog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
    });

    if (!existingBlog) {
      return error({
        status: 404,
        message: "Blog not found",
      });
    }

    const blog = await prisma.blog.delete({
      where: {
        id: existingBlog.id,
      },
    });

    // Related SEO is automatically deleted by onDelete: Cascade

    return success({
      status: 200,
      message: "Blog deleted successfully",
      data: blog,
    });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);

    return error({
      status: 500,
      message: "Something went wrong",
    });
  }
}
