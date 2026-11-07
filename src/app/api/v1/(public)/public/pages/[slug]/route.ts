import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    const page = await prisma.page.findFirst({
      where: {
        slug,
      },
      include: {
        seo: {
          select: {
            schema_markup: true,
          }
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          message: "Page not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Page fetched successfully",
        data: withAbsoluteAssetUrls(page, req.url),
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
