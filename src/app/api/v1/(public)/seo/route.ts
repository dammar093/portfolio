
import { NextRequest } from "next/server";

import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";
import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const seo = await prisma.seo.findFirst({
        where: {
        setting_id:"550e8400-e29b-41d4-a716-446655440000"
    }
    });

    if (!seo) {
      return error({
        status: 404,
        message: "SEO settings not found",
      });
    }

    return success({
      status: 200,
      message: "SEO settings fetched successfully",
      data: withAbsoluteAssetUrls(seo, req.url),
    });
  } catch (err) {
    console.error("GET_SEO_SETTINGS_ERROR:", err);

    return error({
      status: 500,
      message: "Something went wrong while fetching SEO settings",
    });
  }
}
