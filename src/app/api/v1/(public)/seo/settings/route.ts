import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/api-response";
import { SeoType } from "@/generated/prisma/enums";
import { NextRequest } from "next/server";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(req: NextRequest) {
  try {
    const setting = await prisma.seo.findFirst({
      where: {
        slug: "global",
        seo_type: SeoType.SETTING,
      },
    });

    if (!setting) {
      return error({
        status: 404,
        message: "Site SEO not found",
      });
    }

    return success({
      status: 200,
      message: "Site SEO fetched successfully",
      data: withAbsoluteAssetUrls(setting, req.url),
    });
  } catch (err) {
    console.error("GET Site SEO Error:", err);

    return error({
      status: 500,
      message: "Failed to fetch site SEO",
    });
  }
}
