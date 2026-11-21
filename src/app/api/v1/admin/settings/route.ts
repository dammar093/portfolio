
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { success, error } from "@/lib/api-response";
import { uploadImage } from "@/lib/upload-image";

import { settingSchema } from "@/app/admin/site-settings/_schema/setting-schema";

// =====================================
// CONSTANTS
// =====================================

const SETTING_ID = "550e8400-e29b-41d4-a716-446655440000";

// =====================================
// SEO DESCRIPTION HELPER
// =====================================

function getSeoDescription(description: string): string {
  return Array.from(description.trim()).slice(0, 160).join("");
}

// =====================================
// CREATE SEO ONLY IF NOT EXISTS
// =====================================

async function createSettingSeo(setting: {
  id: string;
  name: string;
  description: string;
  logo: string | null;
}) {
  await prisma.seo.createMany({
    data: [
      {
        og_ttile: setting.name,
        slug: `setting-${setting.id}`,
        og_description: getSeoDescription(setting.description),
        og_image: setting.logo,
        seo_type: "SETTING",
        setting_id: setting.id,
      },
    ],
    skipDuplicates: true,
  });
}

// =====================================
// GET SETTING
// =====================================

export async function GET() {
  try {
    const authCheck = await requireAdmin();

    if (!authCheck.ok) {
      return authCheck.response;
    }

    const setting = await prisma.setting.findUnique({
      where: {
        id: SETTING_ID,
      },
    });

    if (!setting) {
      return success({
        status: 200,
        message: "Setting not found",
        data: null,
      });
    }

    // Create SEO only when it does not exist.
    await createSettingSeo(setting);

    // Fetch Setting with SEO.
    const settingWithSeo = await prisma.setting.findUnique({
      where: {
        id: SETTING_ID,
      },
      include: {
        seo: true,
      },
    });

    return success({
      status: 200,
      message: "Setting fetched successfully",
      data: settingWithSeo,
    });
  } catch (err) {
    console.error("GET SETTING ERROR:", err);

    return error({
      status: 500,
      message: "Failed to fetch setting",
    });
  }
}

// =====================================
// CREATE / UPDATE SETTING
// =====================================

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireAdmin();

    if (!authCheck.ok) {
      return authCheck.response;
    }

    const formData = await req.formData();

    // =====================================
    // EXTRACT TEXT FIELDS
    // =====================================

    const rawData = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      address: formData.get("address")?.toString() ?? "",
      g_tag: formData.get("g_tag")?.toString() ?? "",
      linkedin_link: formData.get("linkedin_link")?.toString() ?? "",
      github_link: formData.get("github_link")?.toString() ?? "",
      youtube_link: formData.get("youtube_link")?.toString() ?? "",
      facebook_link: formData.get("facebook_link")?.toString() ?? "",
      instagram_link: formData.get("instagram_link")?.toString() ?? "",
    };

    // =====================================
    // VALIDATE DATA
    // =====================================

    const validation = settingSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    // =====================================
    // FIND EXISTING SETTING
    // =====================================

    const existingSetting = await prisma.setting.findUnique({
      where: {
        id: SETTING_ID,
      },
    });

    // =====================================
    // HANDLE LOGO
    // =====================================

    let logo = existingSetting?.logo ?? null;

    const logoFile = formData.get("logo");

    if (logoFile instanceof File && logoFile.size > 0) {
      if (!logoFile.type.startsWith("image/")) {
        return error({
          status: 400,
          message: "Please upload a valid image",
        });
      }

      if (logoFile.size > 5 * 1024 * 1024) {
        return error({
          status: 400,
          message: "Logo must not exceed 5MB",
        });
      }

      const uploadedLogo = await uploadImage(
        logoFile,
        "settings",
      );

      logo = uploadedLogo.path;
    }

    // =====================================
    // PREPARE SETTING DATA
    // =====================================

    const {
      name,
      email,
      phone,
      description,
      address,
      g_tag,
      linkedin_link,
      github_link,
      youtube_link,
      facebook_link,
      instagram_link,
    } = validation.data;

    const settingData = {
      name,
      email,
      phone,
      description,
      address,
      g_tag: g_tag || null,
      linkedin_link: linkedin_link || null,
      github_link: github_link || null,
      youtube_link: youtube_link || null,
      facebook_link: facebook_link || null,
      instagram_link: instagram_link || null,
      logo,
    };

    // =====================================
    // CREATE / UPDATE SETTING
    // =====================================

    const setting = await prisma.setting.upsert({
      where: {
        id: SETTING_ID,
      },

      update: settingData,

      create: {
        id: SETTING_ID,
        ...settingData,
      },
    });

    // =====================================
    // CREATE SEO ONLY IF NOT EXISTS
    // =====================================

    await createSettingSeo(setting);

    // =====================================
    // FETCH SETTING WITH SEO
    // =====================================

    const settingWithSeo = await prisma.setting.findUnique({
      where: {
        id: SETTING_ID,
      },
      include: {
        seo: true,
      },
    });

    return success({
      status: existingSetting ? 200 : 201,
      message: existingSetting
        ? "Setting updated successfully"
        : "Setting created successfully",
      data: settingWithSeo,
    });
  } catch (err) {
    console.error("SAVE SETTING ERROR:", err);

    return error({
      status: 500,
      message: "Failed to save setting",
    });
  }
}
