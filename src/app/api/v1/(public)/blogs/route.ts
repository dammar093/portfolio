
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(req: NextRequest) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
         seo:true
        },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blogs fetched successfully",
        data: withAbsoluteAssetUrls(blogs, req.url),
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET_PROJECTS_ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
