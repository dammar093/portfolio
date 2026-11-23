
import type { MetadataRoute } from "next";
import {
    baseUrl,
  fetchBlogs,
  fetchProjects,
  fetchServices,
} from "@/api/api";

const staticPages = [
  "",
  "/projects",
  "/blogs",
  "/services",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const [projects, blogs, services] = await Promise.all([
      fetchProjects(),
      fetchBlogs(),
      fetchServices(),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = (projects ?? [])
      .filter((item: any) => item.slug)
      .map((item: any) => ({
        url: `${baseUrl}/projects/${item.slug}`,
        lastModified: item.updatedAt
          ? new Date(item.updatedAt)
          : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    const blogRoutes: MetadataRoute.Sitemap = (blogs ?? [])
      .filter((item: any) => item.slug)
      .map((item: any) => ({
        url: `${baseUrl}/blogs/${item.slug}`,
        lastModified: item.updatedAt
          ? new Date(item.updatedAt)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const serviceRoutes: MetadataRoute.Sitemap = (services ?? [])
      .filter((item: any) => item.slug)
      .map((item: any) => ({
        url: `${baseUrl}/services/${item.slug}`,
        lastModified: item.updatedAt
          ? new Date(item.updatedAt)
          : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    return [
      ...staticRoutes,
      ...projectRoutes,
      ...blogRoutes,
      ...serviceRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticRoutes;
  }
}
