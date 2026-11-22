
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        languages: {
          include: {
            language: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Projects fetched successfully",
        data: withAbsoluteAssetUrls(projects, req.url),
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
