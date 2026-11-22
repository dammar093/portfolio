import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(
  req: NextRequest
) {
  try {
   
    const experiences = await prisma.experience.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });


    return NextResponse.json(
      {
        success: true,
        message: "Experience fetched successfully",
        data: withAbsoluteAssetUrls(experiences, req.url),
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
