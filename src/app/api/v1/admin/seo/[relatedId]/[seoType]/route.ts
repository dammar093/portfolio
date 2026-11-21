import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { success, error } from "@/lib/api-response";
import { seoUpdateSchema } from "@/schema/seo-schema";
import { uploadImage } from "@/lib/upload-image";
import { SeoType } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

const VALID_SEO_TYPES = Object.values(SeoType);
const relatedRecordFilter: Record<
  SeoType,
  (relatedId: string) => Prisma.SeoWhereInput
> = {
  [SeoType.PAGE]: (relatedId) => ({ page_id: relatedId }),
  [SeoType.SETTING]: (relatedId) => ({ setting_id: relatedId }),
  [SeoType.BLOG]: (relatedId) => ({ blog_id: relatedId }),
  [SeoType.PROJECT]: (relatedId) => ({ project_id: relatedId }),
};

async function findOrCreateSeo(relatedId: string, seoType: SeoType) {
  const where = {
    seo_type: seoType,
    ...relatedRecordFilter[seoType](relatedId),
  };

  const existing = await prisma.seo.findFirst({ where });

  if (existing) return existing;

  switch (seoType) {
    case SeoType.PAGE: {
      const page = await prisma.page.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          description: true,
        },
      });

      if (!page) return null;

      return prisma.seo.upsert({
        where: { page_id: relatedId },
        create: {
          og_ttile: page.title,
          slug: page.slug,
          og_image: page.image,
          og_description: Array.from(page.description).slice(0, 160).join(""),
          seo_type: SeoType.PAGE,
          page_id: page.id,
        },
        update: {},
      });
    }

    case SeoType.SETTING: {
      const setting = await prisma.setting.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          name: true,
          logo: true,
          description: true,
        },
      });

      if (!setting) return null;

      return prisma.seo.upsert({
        where: { setting_id: relatedId },
        create: {
          og_ttile: setting.name,
          slug: `setting-${setting.id}`,
          og_image: setting.logo,
          og_description: Array.from(setting.description)
            .slice(0, 160)
            .join(""),
          seo_type: SeoType.SETTING,
          setting_id: setting.id,
        },
        update: {},
      });
    }

    case SeoType.BLOG: {
      const blog = await prisma.blog.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          description: true,
        },
      });

      if (!blog) return null;

      return prisma.seo.upsert({
        where: { blog_id: relatedId },
        create: {
          og_ttile: blog.title,
          slug: blog.slug,
          og_image: blog.image,
          og_description: Array.from(blog.description).slice(0, 160).join(""),
          seo_type: SeoType.BLOG,
          blog_id: blog.id,
        },
        update: {},
      });
    }

    case SeoType.PROJECT: {
      const project = await prisma.project.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          description: true,
        },
      });

      if (!project) return null;

      return prisma.seo.upsert({
        where: { project_id: relatedId },
        create: {
          og_ttile: project.title,
          slug: project.slug,
          og_image: project.image,
          og_description: Array.from(project.description)
            .slice(0, 160)
            .join(""),
          seo_type: SeoType.PROJECT,
          project_id: project.id,
        },
        update: {},
      });
    }

    default:
      return null;
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ relatedId: string; seoType: string }> },
) {
  const authCheck = await requireAdmin();
  if (!authCheck.ok) return authCheck.response;

  const { relatedId, seoType } = await context.params;

  if (!VALID_SEO_TYPES.includes(seoType as SeoType)) {
    return error({ status: 400, message: "Invalid SEO type" });
  }

  const parsedSeoType = seoType as SeoType;

  try {
    const seo = await findOrCreateSeo(relatedId, parsedSeoType);

    if (!seo) {
      return error({ status: 404, message: "SEO not found" });
    }

    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());
    const image = formData.get("og_image");

    const parsed = seoUpdateSchema.partial().safeParse({
      og_ttile: payload.og_ttile,
      og_description: payload.og_description,
      keywords: payload.keywords,
      schema_markup: payload.schema_markup,
      og_image: image instanceof File && image.size > 0 ? image : undefined,
    });

    if (!parsed.success) {
      return error({ status: 400, message: "Invalid SEO fields" });
    }

    let imagePath = seo.og_image;

    if (parsed.data.og_image) {
      const upload = await uploadImage(parsed.data.og_image, "seo");
      imagePath = upload.path;
    }

    const schemaMarkup = parsed.data.schema_markup;
    const updated = await prisma.seo.update({
      where: { id: seo.id },
      data: {
        og_ttile: parsed.data.og_ttile,
        og_description: parsed.data.og_description,
        keywords: parsed.data.keywords,
        og_image: imagePath,
        schema_markup:
          schemaMarkup === undefined
            ? undefined
            : schemaMarkup
              ? JSON.parse(schemaMarkup)
              : Prisma.DbNull,
      },
    });

    return success({
      status: 200,
      message: "SEO updated successfully",
      data: withAbsoluteAssetUrls(updated, req.url),
    });
  } catch (err) {
    console.error(err);
    return error({ status: 500, message: "Something went wrong" });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ relatedId: string; seoType: string }> },
) {
  const authCheck = await requireAdmin();
  if (!authCheck.ok) return authCheck.response;

  const { relatedId, seoType } = await context.params;

  if (!VALID_SEO_TYPES.includes(seoType as SeoType)) {
    return error({ status: 400, message: "Invalid SEO type" });
  }

  const parsedSeoType = seoType as SeoType;

  try {
    const seo = await findOrCreateSeo(relatedId, parsedSeoType);

    if (!seo) {
      return error({ status: 404, message: "SEO not found" });
    }

    return success({
      status: 200,
      message: "SEO fetched successfully",
      data: withAbsoluteAssetUrls(seo, req.url),
    });
  } catch (err) {
    console.error(err);
    return error({ status: 500, message: "Something went wrong" });
  }
}
