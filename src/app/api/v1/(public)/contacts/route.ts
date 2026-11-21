
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/api-response";
import { sendContactEmails } from "@/lib/email/mailer";

const contactSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email address is too long"),

  forWhat: z
    .string()
    .trim()
    .min(1, "Inquiry type is required")
    .max(150, "Inquiry type is too long"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

// =====================================
// PUBLIC CONTACT POST
// =====================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your contact form information",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { fullname, email, forWhat, message } = parsed.data;

    // Save contact message
    const contact = await prisma.contact.create({
      data: {
        fullname,
        email,
        forWhat,
        message,
        isSeen: false,
      },
    });

    // Send emails
    try {
      const emailStatus = await sendContactEmails(contact);

      if (!emailStatus.adminEmailSent) {
        console.error("Admin notification email failed");
      }

      if (!emailStatus.customerEmailSent) {
        console.error("Customer confirmation email failed");
      }
    } catch (emailError) {
      console.error("CONTACT EMAIL ERROR:", emailError);
    }

    return success({
      status: 201,
      message: "Your message has been submitted successfully",
      data: {
        id: contact.id,
      },
    });
  } catch (err) {
    console.error("PUBLIC CONTACT ERROR:", err);

    return error({
      status: 500,
      message: "Unable to submit your message. Please try again later.",
    });
  }
}
