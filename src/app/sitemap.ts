
import type { MetadataRoute } from "next";
import {
    baseUrl,
  fetchBlogs,
  fetchProjects,
} from "@/api/api";

const staticPages = [
  "",
  "/projects",
  "/blogs",
  "/services",
  "/about",
  "/contact",
];

type SitemapEntry = {
  slug?: string | null;
  updatedAt?: string | Date | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const [projects, blogs] = await Promise.all([
      fetchProjects(),
      fetchBlogs(),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = ((projects ?? []) as SitemapEntry[])
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/projects/${item.slug}`,
        lastModified: item.updatedAt
          ? new Date(item.updatedAt)
          : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    const blogRoutes: MetadataRoute.Sitemap = ((blogs ?? []) as SitemapEntry[])
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/blogs/${item.slug}`,
        lastModified: item.updatedAt
          ? new Date(item.updatedAt)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [
      ...staticRoutes,
      ...projectRoutes,
      ...blogRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticRoutes;
  }
}
