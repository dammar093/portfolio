import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(
  req: NextRequest
) {
  try {
   
    const setting = await prisma.setting.findUnique({
      where: {
        id:"550e8400-e29b-41d4-a716-446655440000",
      },
      include: {
        seo: {
          select: {
            schema_markup: true,
          }
        },
      },
    });

    if (!setting) {
      return NextResponse.json(
        {
          success: false,
          message: "Setting not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Setting fetched successfully",
        data: withAbsoluteAssetUrls(setting, req.url),
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
