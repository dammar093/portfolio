import { SeoType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const fetchPageBySlug = async (slug: string) => {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      seo: {
        select: {
          schema_markup: true,
        },
      },
    },
  });
};

export const fetchSeoBySlugAndType = async (
  slug: string,
  seoType: SeoType,
) => {
  return prisma.seo.findFirst({
    where: {
      slug,
      seo_type: seoType,
    },
  });
};

export const fetchSeoSettings = async () => {
  return prisma.seo.findFirst({
    where: {
      slug: "global",
      seo_type: SeoType.SETTING,
    },
  });
};