import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { ImageWithLoader } from "@/components/shared/ImageWithLoader";
import { fetchProjectBySlug, fetchSeoBySlugAndType } from "@/api/api";
import { ProjectItem } from "@/app/admin/projects/_types/project";
import { JsonLd } from "@/components/shared/JsonLoad";
import type { Metadata } from "next";
import { SeoType } from "@/generated/prisma/enums";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;

  const project: ProjectItem = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const languages = (project.languages ?? []).filter(
    (item: any) => item?.language,
  );

  return (
    <main className="px-4 py-10 md:py-14">
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
          <div className="flex items-center gap-3">
            <span className="h-1 w-10 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Project
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {project.title}
          </h1>

          {languages.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {languages.map((item: any) => (
                <li
                  key={item.language.id}
                  className="rounded-full border border-gray-200 bg-gray-100 px-3.5 py-1 text-sm font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                >
                  {item.language.name}
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
            className="project-description prose prose-gray max-w-none dark:prose-invert prose-img:rounded-lg prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: project.description || "" }}
          />
        </section>

        {/* Live Link */}
        {project.link && (
          <div className="flex justify-end">
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
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


// generateMetadata 
export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoBySlugAndType("projects", SeoType.PROJECT);

  if (!seo) {
    return {
      
    };
  }

  return {
    title: seo.og_title,
    description: seo.og_description || "",
    keywords: seo.keywords
      ? seo.keywords.split(",").map((keyword: string) => keyword.trim())
      : undefined,

    openGraph: {
      title: seo.og_title,
      description: seo.og_description || "",
      images: seo.og_image ? [seo.og_image] : [],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: seo.og_title ,
      description: seo.og_description || "",
      images: seo.og_image ? [seo.og_image] : [],
    },

    alternates: {
      canonical: seo.canonical_url || undefined,
    },
  };
}
