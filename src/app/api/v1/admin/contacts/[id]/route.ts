
import { NextRequest } from "next/server";

import { error, success } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type ContactRouteContext = {
  params: Promise<{ id: string }>;
};

// =====================================
// GET SINGLE CONTACT AND MARK AS SEEN
// =====================================
export async function GET(
  _req: NextRequest,
  context: ContactRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id } = await context.params;

  try {
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return error({
        status: 404,
        message: "Contact not found",
      });
    }

    // Automatically mark contact as seen when opened
    const contact = existingContact.isSeen
      ? existingContact
      : await prisma.contact.update({
          where: { id },
          data: { isSeen: true },
        });

    return success({
      status: 200,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (err) {
    console.error("FETCH CONTACT ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch contact",
    });
  }
}

// =====================================
// DELETE CONTACT
// =====================================
export async function DELETE(
  _req: NextRequest,
  context: ContactRouteContext,
) {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) return authCheck.response;

  const { id } = await context.params;

  try {
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return error({
        status: 404,
        message: "Contact not found",
      });
    }

    const contact = await prisma.contact.delete({
      where: { id },
    });

    return success({
      status: 200,
      message: "Contact deleted successfully",
      data: contact,
    });
  } catch (err) {
    console.error("DELETE CONTACT ERROR:", err);

    return error({
      status: 500,
      message: "Failed to delete contact",
    });
  }
}
