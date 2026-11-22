import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(
  req: NextRequest
) {
  try {
   
    const languages = await prisma.language.findMany({
      where: {
        isActive:true,
        
      },
    });


    return NextResponse.json(
      {
        success: true,
        message: "Languages fetched successfully",
        data: withAbsoluteAssetUrls(languages, req.url),
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
