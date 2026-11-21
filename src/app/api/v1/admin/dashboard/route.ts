
import { NextResponse } from "next/server";

import { error } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const authCheck = await requireAdmin();

  if (!authCheck.ok) {
    return authCheck.response;
  }

  try {
    const [
      users,
      projects,
      activeProjects,
      languages,
      activeLanguages,
      services,
      activeServices,
      testimonials,
      activeTestimonials,
      blogs,
      activeBlogs,
      experiences,
      activeExperiences,
      faqs,
      activeFaqs,
      pages,
      contacts,
      unseenContacts,
      settings,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.project.count(),
      prisma.project.count({ where: { isActive: true } }),

      prisma.language.count(),
      prisma.language.count({ where: { isActive: true } }),

      prisma.services.count(),
      prisma.services.count({ where: { isActive: true } }),

      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isActive: true } }),

      prisma.blog.count(),
      prisma.blog.count({ where: { isActive: true } }),

      prisma.experience.count(),
      prisma.experience.count({ where: { isActive: true } }),

      prisma.fAQ.count(),
      prisma.fAQ.count({ where: { isActive: true } }),

      prisma.page.count(),

      prisma.contact.count(),
      prisma.contact.count({ where: { isSeen: false } }),

      prisma.setting.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: {
          users,

          projects: {
            total: projects,
            active: activeProjects,
            inactive: projects - activeProjects,
          },

          languages: {
            total: languages,
            active: activeLanguages,
            inactive: languages - activeLanguages,
          },

          services: {
            total: services,
            active: activeServices,
            inactive: services - activeServices,
          },

          testimonials: {
            total: testimonials,
            active: activeTestimonials,
            inactive: testimonials - activeTestimonials,
          },

          blogs: {
            total: blogs,
            active: activeBlogs,
            inactive: blogs - activeBlogs,
          },

          experiences: {
            total: experiences,
            active: activeExperiences,
            inactive: experiences - activeExperiences,
          },

          faqs: {
            total: faqs,
            active: activeFaqs,
            inactive: faqs - activeFaqs,
          },

          pages,

          contacts: {
            total: contacts,
            unseen: unseenContacts,
            seen: contacts - unseenContacts,
          },

          settings,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("DASHBOARD STATISTICS ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch dashboard statistics",
    });
  }
}
