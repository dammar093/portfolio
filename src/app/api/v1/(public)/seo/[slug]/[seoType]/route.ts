import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api-response";
import { SeoType } from "@/generated/prisma/enums";
import { NextRequest } from "next/server";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

type SeoRouteContext = {
  params: Promise<{
    slug: string;
    seoType: string;
  }>;
};

export async function GET(req: NextRequest, context: SeoRouteContext) {
  try {
    const { slug, seoType } = await context.params;

    // Validate SEO type
    if (!Object.values(SeoType).includes(seoType as SeoType)) {
      return error({
        status: 400,
        message: `Invalid SEO type: ${seoType}`,
      });
    }

    // Find SEO by slug and type
    const seo = await prisma.seo.findFirst({
      where: {
        slug,
        seo_type: seoType as SeoType,
      },
    });

    if (!seo) {
      return error({
        status: 404,
        message: "SEO not found",
      });
    }

    return success({
      status: 200,
      message: "SEO fetched successfully",
      data: withAbsoluteAssetUrls(seo, req.url),
    });
  } catch (err) {
    console.error("GET_SEO_ERROR:", err);

    return error({
      status: 500,
      message: "Something went wrong while fetching SEO",
    });
  }
}
