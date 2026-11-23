import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

import { ImageWithLoader } from "@/components/shared/ImageWithLoader";
import { baseUrl, fetchProjectBySlug, fetchSeoBySlugAndType } from "@/api/api";
import type { ProjectItem } from "@/app/admin/projects/_types/project";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import { SeoItem } from "@/types/seo-type";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";


// ======================================
// PROJECT DETAIL PAGE
// ======================================

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;

  const project: ProjectItem | null = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const languages = (project.languages ?? []).filter((item) => item?.language);

  return (
    <main className="py-10 md:py-14">
      {project.seo?.schema_markup && (
        <JsonLd data={project.seo.schema_markup} />
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        {/* Back Button */}
        <Link
          href="/projects"
          className="group flex w-fit items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Projects
        </Link>

        {/* Header */}
        <header className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {project.title}
          </h1>

          {languages.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {languages.map((item) => (
                <li
                  key={item?.language?.id}
                  className="rounded-full border border-gray-200 bg-gray-100 px-3.5 py-1 text-sm font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                >
                  {item?.language?.name}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm dark:border-white/10 dark:bg-white/5">
          <ImageWithLoader
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            width={1200}
            height={700}
            loading="eager"
          />
        </div>

        {/* Description */}
        <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] md:p-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            About this project
          </h2>

          <div
            className="rich-content project-description max-w-none"
            dangerouslySetInnerHTML={{
              __html: project.description || "",
            }}
          />
        </section>

        {/* Live Link */}
        {project.link && (
          <div className="flex justify-end">
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Visit Live Project
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProjectDetailPage;

// ======================================
// GENERATE DYNAMIC PROJECT SEO
// ======================================

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const seo: SeoItem = await fetchSeoBySlugAndType(slug, SeoType.PROJECT);

  if (!seo) {
    return {};
  }

  const title = seo?.og_ttile;

  const image = seo?.og_image;

  const keywords = seo?.keywords
    ? seo.keywords
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter(Boolean)
    : undefined;

  const canonicalUrl = `${baseUrl}/projects/${slug}`;
  const description = seo.og_description;
  return {
    title,
    description,
    keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Portfolio",
      type: "article",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
