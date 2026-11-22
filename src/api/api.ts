import { ContactFormData } from "@/app/admin/contacts/_schema/contact-schema";
import { SeoType } from "@/generated/prisma/enums";
import axios from "axios";
export const dynamic = "force-dynamic";

export const baseUrl = process.env.AUTH_URL!;

export const fetchPageBySlug = async (slug: string) => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/pages/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchSeoBySlugAndType = async (slug: string, seoType: SeoType) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/v1/seo/${encodeURIComponent(slug)}/${encodeURIComponent(seoType)}`,
    );

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("SEO FETCH ERROR:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      });
    } else {
      console.error("SEO FETCH ERROR:", error);
    }

    return null;
  }
};

export const fetchSeoSettings = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/seo`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    return res.data.data ?? null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("SEO FETCH ERROR:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      });
    } else {
      console.error("SEO FETCH ERROR:", error);
    }

    return null;
  }
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
    const res = await axios.get(`${baseUrl}/api/v1/languages`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchExperiences = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/experiences`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchProjects = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/projects`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchProjectBySlug = async (slug: string) => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/projects/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchBlogs = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/blogs`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchBlogBySlug = async (slug: string) => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/blogs/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const fetchServices = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/services`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
};

export const createContact = async (data: ContactFormData) => {
  try {
    const res = await axios.post("/api/v1/contacts", data);
    return res.data as { success: boolean; message: string };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fieldErrors = error.response?.data?.errors?.fieldErrors as
        | Record<string, string[]>
        | undefined;

      const details = fieldErrors
        ? Object.entries(fieldErrors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join(" | ")
        : "";

      throw new Error(
        [error.response?.data?.message || "Something went wrong.", details]
          .filter(Boolean)
          .join(" - "),
      );
    }
    throw error;
  }
};

export const fetchFaqs = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/faqs`);
    return res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch faqs", error);
    return [];
  }
};