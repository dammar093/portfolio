
import nodemailer from "nodemailer";

import { loadEmailTemplate } from "./email-template";

interface ContactEmailData {
  fullname: string;
  email: string;
  forWhat: string;
  message: string;
  createdAt: Date;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendContactEmails(contact: ContactEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const sender = process.env.MAIL_FROM || process.env.SMTP_USER;

  if (
    !adminEmail ||
    !sender ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("Email environment variables are not configured");
  }

  const templateData = {
    FULLNAME: contact.fullname,
    EMAIL: contact.email,
    FORWHAT: contact.forWhat,
    MESSAGE: contact.message,
    CREATED_AT: contact.createdAt,
  };

  const [adminHtml, customerHtml] = await Promise.all([
    loadEmailTemplate("contact-admin.html", templateData),
    loadEmailTemplate("contact-customer.html", templateData),
  ]);

  const results = await Promise.allSettled([
    // Admin notification
    transporter.sendMail({
      from: sender,
      to: adminEmail,
      replyTo: {
        name: contact.fullname,
        address: contact.email,
      },
      subject: `New Contact Message - ${contact.fullname}`,
      html: adminHtml,
    }),

    // Customer confirmation
    transporter.sendMail({
      from: sender,
      to: contact.email,
      subject: "Thank You for Contacting Me",
      html: customerHtml,
    }),
  ]);

  return {
    adminEmailSent: results[0].status === "fulfilled",
    customerEmailSent: results[1].status === "fulfilled",
    results,
  };
}
