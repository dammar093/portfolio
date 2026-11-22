import {
  fetchPageBySlug,
  fetchProjects,
  fetchSeoBySlugAndType,
} from "@/api/api";
import ProjectCard from "@/components/ProjectCard";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const siteUrl =
  process.env.NEXT_PUBLIC_FRONTEND_URL ??
  process.env.AUTH_URL ??
  "http://localhost:3000";
const projectsUrl = new URL("/projects", siteUrl);
const absoluteAssetUrl = (assetPath: string) =>
  new URL(assetPath, siteUrl).toString();

const Projects = async () => {
  const [page, projects] = await Promise.all([
    fetchPageBySlug("projects"),
    fetchProjects(),
  ]);

  if (!page) notFound();

  return (
    <>
      {page.seo?.schema_markup && <JsonLd data={page.seo.schema_markup} />}

      <section className="flex h-full w-full flex-col gap-5">
        <div className="mx-auto w-full max-w-5xl space-y-8 py-8">
          <header className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-800">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {page.short_title}
            </h1>
          </header>

          <article className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-8 prose-p:text-gray-600 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-sm dark:prose-invert dark:prose-p:text-gray-300">
            <div dangerouslySetInnerHTML={{ __html: page.description || "" }} />
          </article>
        </div>

        {projects.length > 0 ? (
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No projects found.
          </p>
        )}
      </section>
    </>
  );
};

export default Projects;

// generateMetadata 
export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoBySlugAndType("projects", SeoType.PAGE);

  if (!seo) {
    return {
      title: "Blogs & Articles",
      description: "Explore articles, tutorials, experiences, and insights.",
    };
  }

  return {
    title: seo.og_title || "Blogs & Articles",
    description: seo.og_description || "",
    keywords: seo.keywords
      ? seo.keywords.split(",").map((keyword: string) => keyword.trim())
      : undefined,

    openGraph: {
      title: seo.og_title || "Blogs & Articles",
      description: seo.og_description || "",
      images: seo.og_image ? [seo.og_image] : [],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: seo.og_title || "Blogs & Articles",
      description: seo.og_description || "",
      images: seo.og_image ? [seo.og_image] : [],
    },

    alternates: {
      canonical: seo.canonical_url || undefined,
    },
  };
}
