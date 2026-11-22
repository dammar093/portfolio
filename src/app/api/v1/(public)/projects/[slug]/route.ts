
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAbsoluteAssetUrls } from "@/lib/absolute-asset-urls";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const project = await prisma.project.findFirst({
      where: {
        slug,
        isActive: true,
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
        seo: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project fetched successfully",
        data: withAbsoluteAssetUrls(project, req.url),
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET_PROJECT_BY_SLUG_ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
