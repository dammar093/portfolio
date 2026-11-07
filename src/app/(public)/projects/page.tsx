import { fetchPageBySlug, fetchSeoBySlugAndType } from "@/api/api";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/components/ProjectSection";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl =
  process.env.NEXT_PUBLIC_FRONTEND_URL ??
  process.env.AUTH_URL ??
  "http://localhost:3000";
const projectsUrl = new URL("/projects", siteUrl);
const absoluteAssetUrl = (assetPath: string) =>
  new URL(assetPath, siteUrl).toString();

const Projects = async () => {
  const page = await fetchPageBySlug("projects");
  if (!page) notFound();
  return (
    <>
      {page?.seo?.schema_markup && <JsonLd data={page.seo?.schema_markup} />}
      <section className=" w-full h-full flex flex-col gap-5">
        <div className="mx-auto w-full max-w-5xl space-y-8 py-8">
          {/* Page Header */}
          <header className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-800">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {page?.short_title}
            </h1>
          </header>

          {/* Page Content */}
          <article
            className="
      prose prose-lg max-w-none
      prose-headings:font-semibold
      prose-headings:tracking-tight
      prose-p:leading-8
      prose-p:text-gray-600
      prose-a:text-blue-600
      prose-img:rounded-xl
      prose-img:shadow-sm
      dark:prose-invert
      dark:prose-p:text-gray-300
    "
          >
            <div
              dangerouslySetInnerHTML={{
                __html: page?.description || "",
              }}
            />
          </article>
        </div>
        <div className="flex gap-2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center md:justify-between ">
          {projects?.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Projects;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoBySlugAndType("projects", SeoType.PAGE);

  const title = seo?.og_ttile;
  const description = seo?.og_description;

  const image = seo?.og_image ? absoluteAssetUrl(seo.og_image) : undefined;

  const keywords = seo?.keywords
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: projectsUrl,
    },
    keywords: keywords,

    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Portfolio",
      url: projectsUrl,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
