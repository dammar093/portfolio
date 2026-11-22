import { SeoType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import axios from "axios";

const baseUrl = process.env.AUTH_URL!;

export const fetchPageBySlug = async (slug: string) => {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      seo: {
        select: {
          schema_markup: true,
        },
      },
    },
  });
};

export const fetchSeoBySlugAndType = async (slug: string, seoType: SeoType) => {
  return prisma.seo.findFirst({
    where: {
      slug,
      seo_type: seoType,
    },
  });
};

export const fetchSeoSettings = async () => {
  return prisma.seo.findFirst({
    where: {
      slug: "global",
      seo_type: SeoType.SETTING,
    },
  });
};

export const fetchSetting = async () => {
  try {
    const res = await axios(`${baseUrl}/api/v1/settings`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchLanuage = async () => {
  try {
    const res = await axios(`${baseUrl}/api/v1/languages`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};


export const fetchExperiences = async () => {
  try {
    const res = await axios(`${baseUrl}/api/v1/experiences`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchProjects = async () => {
  try {
    const res = await axios(`${baseUrl}/api/v1/projects`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchProjectBySlug = async (slug: string) => {
  try {
    const res = await axios(`${baseUrl}/api/v1/projects/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};


