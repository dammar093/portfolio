
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

type RelatedRecord = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  description: string;
};

const relatedRecordFilter: Record<
  SeoType,
  (relatedId: string) => Prisma.SeoWhereInput
> = {
  [SeoType.PAGE]: (relatedId) => ({
    page_id: relatedId,
  }),
  [SeoType.SETTING]: (relatedId) => ({
    setting_id: relatedId,
  }),
  [SeoType.BLOG]: (relatedId) => ({
    blog_id: relatedId,
  }),
  [SeoType.PROJECT]: (relatedId) => ({
    project_id: relatedId,
  }),
};

async function getRelatedRecord(
  relatedId: string,
  seoType: SeoType,
): Promise<RelatedRecord | null> {
  switch (seoType) {
    case SeoType.PAGE:
      return prisma.page.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          description: true,
        },
      });

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

      return {
        id: setting.id,
        title: setting.name,
        slug: `setting-${setting.id}`,
        image: setting.logo,
        description: setting.description,
      };
    }

    case SeoType.BLOG:
      return prisma.blog.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          description: true,
        },
      });

    case SeoType.PROJECT:
      return prisma.project.findUnique({
        where: { id: relatedId },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          description: true,
        },
      });

    default:
      return null;
  }
}

async function findOrCreateSeo(
  relatedId: string,
  seoType: SeoType,
) {
  const where = {
    seo_type: seoType,
    ...relatedRecordFilter[seoType](relatedId),
  };

  // First check whether SEO already exists.
  const existing = await prisma.seo.findFirst({
    where,
  });

  if (existing) return existing;

  // Find the related record.
  const relatedRecord = await getRelatedRecord(
    relatedId,
    seoType,
  );

  if (!relatedRecord) return null;

  const description = Array.from(
    relatedRecord.description ?? "",
  )
    .slice(0, 160)
    .join("");

  // Create SEO record.
  // The unique foreign-key constraints are expected
  // to be defined in the Prisma schema.
  switch (seoType) {
    case SeoType.PAGE:
      return prisma.seo.upsert({
        where: {
          page_id: relatedId,
        },
        create: {
          og_ttile: relatedRecord.title,
          slug: relatedRecord.slug,
          og_image: relatedRecord.image,
          og_description: description,
          seo_type: SeoType.PAGE,
          page_id: relatedId,
        },
        update: {},
      });

    case SeoType.SETTING:
      return prisma.seo.upsert({
        where: {
          setting_id: relatedId,
        },
        create: {
          og_ttile: relatedRecord.title,
          slug: relatedRecord.slug,
          og_image: relatedRecord.image,
          og_description: description,
          seo_type: SeoType.SETTING,
          setting_id: relatedId,
        },
        update: {},
      });

    case SeoType.BLOG:
      return prisma.seo.upsert({
        where: {
          blog_id: relatedId,
        },
        create: {
          og_ttile: relatedRecord.title,
          slug: relatedRecord.slug,
          og_image: relatedRecord.image,
          og_description: description,
          seo_type: SeoType.BLOG,
          blog_id: relatedId,
        },
        update: {},
      });

    case SeoType.PROJECT:
      return prisma.seo.upsert({
        where: {
          project_id: relatedId,
        },
        create: {
          og_ttile: relatedRecord.title,
          slug: relatedRecord.slug,
          og_image: relatedRecord.image,
          og_description: description,
          seo_type: SeoType.PROJECT,
          project_id: relatedId,
        },
        update: {},
      });

    default:
      return null;
  }
}

function validateParams(
  relatedId: string,
  seoType: string,
) {
  if (!relatedId || !/^[0-9a-f-]{36}$/i.test(relatedId)) {
    return "Invalid related record ID";
  }

  if (!VALID_SEO_TYPES.includes(seoType as SeoType)) {
    return "Invalid SEO type";
  }

  return null;
}

// GET SEO
export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      relatedId: string;
      seoType: string;
    }>;
  },
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { relatedId, seoType } = await context.params;

  const validationError = validateParams(
    relatedId,
    seoType,
  );

  if (validationError) {
    return error({
      status: 400,
      message: validationError,
    });
  }

  try {
    const seo = await findOrCreateSeo(
      relatedId,
      seoType as SeoType,
    );

    if (!seo) {
      return error({
        status: 404,
        message: "Related record not found",
      });
    }

    return success({
      status: 200,
      message: "SEO fetched successfully",
      data: withAbsoluteAssetUrls(seo, req.url),
    });
  } catch (err) {
    console.error("GET SEO ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch SEO data",
    });
  }
}

// UPDATE SEO
export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{
      relatedId: string;
      seoType: string;
    }>;
  },
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { relatedId, seoType } = await context.params;

  const validationError = validateParams(
    relatedId,
    seoType,
  );

  if (validationError) {
    return error({
      status: 400,
      message: validationError,
    });
  }

  try {
    const seo = await findOrCreateSeo(
      relatedId,
      seoType as SeoType,
    );

    if (!seo) {
      return error({
        status: 404,
        message: "Related record not found",
      });
    }

    const formData = await req.formData();

    const image = formData.get("og_image");

    const rawPayload = {
      og_ttile: formData.get("og_ttile") ?? undefined,
      og_description:
        formData.get("og_description") ?? undefined,
      keywords: formData.get("keywords") ?? undefined,
      schema_markup:
        formData.get("schema_markup") ?? undefined,
      og_image:
        image instanceof File && image.size > 0
          ? image
          : undefined,
    };

    const parsed = seoUpdateSchema.partial().safeParse(
      rawPayload,
    );

    if (!parsed.success) {
      return error({
        status: 400,
        message: "Invalid SEO fields",
      });
    }

    // Validate schema markup before updating.
    let schemaMarkup: Prisma.InputJsonValue | typeof Prisma.DbNull | undefined;

    if (parsed.data.schema_markup !== undefined) {
      if (!parsed.data.schema_markup) {
        schemaMarkup = Prisma.DbNull;
      } else {
        try {
          const json = JSON.parse(
            parsed.data.schema_markup,
          );

          if (
            json === null ||
            typeof json !== "object"
          ) {
            return error({
              status: 400,
              message: "Schema markup must be a valid JSON object or array",
            });
          }

          schemaMarkup = json as Prisma.InputJsonValue;
        } catch {
          return error({
            status: 400,
            message: "Invalid schema markup JSON",
          });
        }
      }
    }

    // Keep existing image when no new image is uploaded.
    let imagePath = seo.og_image;

    if (parsed.data.og_image) {
      const upload = await uploadImage(
        parsed.data.og_image,
        "seo",
      );

      imagePath = upload.path;
    }

    const updated = await prisma.seo.update({
      where: {
        id: seo.id,
      },
      data: {
        og_ttile: parsed.data.og_ttile,
        og_description: parsed.data.og_description,
        keywords: parsed.data.keywords,
        og_image: imagePath,
        schema_markup: schemaMarkup,
      },
    });

    return success({
      status: 200,
      message: "SEO updated successfully",
      data: withAbsoluteAssetUrls(updated, req.url),
    });
  } catch (err) {
    console.error("PATCH SEO ERROR:", err);

    return error({
      status: 500,
      message: "Failed to update SEO",
    });
  }
}
