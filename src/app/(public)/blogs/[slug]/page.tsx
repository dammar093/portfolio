import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { baseUrl, fetchBlogBySlug, fetchSeoBySlugAndType } from "@/api/api";
import BlogShare from "@/components/shared/BlogShare";
import { ImageWithLoader } from "@/components/shared/ImageWithLoader";
import { JsonLd } from "@/components/shared/JsonLoad";
import type { BlogItem } from "@/app/admin/blogs/_types/blog";
import { SeoType } from "@/generated/prisma/enums";
import { SeoItem } from "@/types/seo-type";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getReadingTime = (html: string) => {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;

  return Math.max(1, Math.ceil(words / 200));
};

// ======================================
// GENERATE DYNAMIC SEO METADATA
// ======================================

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo: SeoItem = await fetchSeoBySlugAndType(slug, SeoType.BLOG);

  if (!seo) {
    return {};
  }

  const title = seo?.og_ttile;
  const description = seo?.og_description;
  const image = seo?.og_image;
  const canonicalUrl = `${baseUrl}/blogs/${slug}`;

  return {
    title,
    description,
    keywords: seo?.keywords
      ? seo.keywords.split(",").map((keyword: string) => keyword.trim())
      : undefined,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Portfolio",
      type: "article",
      publishedTime: seo.createdAt,
      modifiedTime: seo.updatedAt,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: seo?.og_ttile,
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
  };
}

// ======================================
// BLOG DETAIL PAGE
// ======================================

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;

  const blog: BlogItem | null = await fetchBlogBySlug(slug);

  if (!blog || !blog.isActive) {
    notFound();
  }

  const readingTime = getReadingTime(blog.description);

  return (
    <main className="py-10 md:py-14">
      {blog.seo?.schema_markup && <JsonLd data={blog.seo.schema_markup} />}

      <article className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Back Navigation */}
        <Link
          href="/blogs"
          className="group flex w-fit items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Blogs
        </Link>

        {/* Header */}
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-teal-500" />
              <time dateTime={blog.createdAt}>
                {formatDate(blog.createdAt)}
              </time>
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-teal-500" />
              {readingTime} min read
            </span>

            <span className="inline-flex items-center gap-2">
              <BookOpen size={16} className="text-teal-500" />
              Article
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {blog.title}
          </h1>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm dark:border-white/10 dark:bg-white/5">
            <ImageWithLoader
              src={blog.image}
              alt={blog.title}
              width={1200}
              height={630}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-[#18181B]">
          <BlogShare title={blog.title} slug={blog.slug} />

          <div
            className="rich-content mt-8 max-w-none break-words"
            dangerouslySetInnerHTML={{
              __html: blog.description,
            }}
          />

          {/* SEO Keywords */}
          {blog.seo?.keywords && (
            <div className="mt-10 border-t border-gray-200 pt-6 dark:border-white/10">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                <span className="text-teal-500">#</span>
                Related Topics
              </h3>

              <div className="flex flex-wrap gap-2">
                {blog.seo.keywords
                  .split(",")
                  .map((keyword) => keyword.trim())
                  .filter(Boolean)
                  .map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                    >
                      {keyword}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center md:p-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Enjoyed this article?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Discover more articles, tutorials, and insights.
            </p>
          </div>

          <Link
            href="/blogs"
            className="group flex shrink-0 items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
          >
            Explore More Blogs
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </article>
    </main>
  );
};

export default BlogDetailPage;
