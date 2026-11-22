import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(
  req: NextRequest
) {
  try {
   
    const services = await prisma.services.findMany({
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
        message: "Services fetched successfully",
        data: withAbsoluteAssetUrls(services, req.url),
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
