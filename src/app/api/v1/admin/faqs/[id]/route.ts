
import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { error, success } from "@/lib/api-response";
import { faqUpdateSchema } from "@/app/admin/faqs/_schema/faq-schema";


type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/v1/admin/faqs/:id
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  const auth = await requireAdmin();

  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return error({
        status: 404,
        message: "FAQ not found",
      });
    }

    return success({
      message: "FAQ fetched successfully",
      data: faq,
    });
  } catch (err) {
    console.error("GET FAQ error:", err);

    return error({
      status: 500,
      message: "Failed to fetch FAQ",
    });
  }
}

// PATCH /api/v1/admin/faqs/:id
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  const auth = await requireAdmin();

  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return error({
        status: 404,
        message: "FAQ not found",
      });
    }

    const formData = await request.formData();

    // Only include fields that were submitted.
    const rawData = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([, value]) => typeof value === "string",
      ),
    );

    const parsed = faqUpdateSchema.safeParse(rawData);

    if (!parsed.success) {
      return error({
        status: 400,
        message: "Validation failed",
      });
    }

    if (Object.keys(parsed.data).length === 0) {
      return error({
        status: 400,
        message: "No fields provided for update",
      });
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: parsed.data,
    });

    return success({
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (err) {
    console.error("PATCH FAQ error:", err);

    return error({
      status: 500,
      message: "Failed to update FAQ",
    });
  }
}

// DELETE /api/v1/admin/faqs/:id
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  const auth = await requireAdmin();

  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return error({
        status: 404,
        message: "FAQ not found",
      });
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    return success({
      message: "FAQ deleted successfully",
      data: { id },
    });
  } catch (err) {
    console.error("DELETE FAQ error:", err);

    return error({
      status: 500,
      message: "Failed to delete FAQ",
    });
  }
}
