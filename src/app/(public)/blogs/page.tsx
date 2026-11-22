import {
  baseUrl,
  fetchBlogs,
  fetchPageBySlug,
  fetchSeoBySlugAndType,
} from "@/api/api";
import type { BlogItem } from "@/app/admin/blogs/_types/blog";
import BlogCard from "@/components/BlogCard";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import { SeoItem } from "@/types/seo-type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// ======================================
// BLOG LISTING PAGE
// ======================================

const BlogsPage = async () => {
  const [page, blogs] = await Promise.all([
    fetchPageBySlug("blogs"),
    fetchBlogs(),
  ]);

  if (!page) notFound();

  const activeBlogs = (blogs as BlogItem[]).filter((blog) => blog.isActive);

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
            <div
              dangerouslySetInnerHTML={{
                __html: page.description || "",
              }}
            />
          </article>
        </div>

        {activeBlogs.length > 0 ? (
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {activeBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              No blogs found
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              New articles and insights will be available soon.
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogsPage;

// ======================================
// GENERATE SEO METADATA
// ======================================

export async function generateMetadata(): Promise<Metadata> {
  const seo: SeoItem = await fetchSeoBySlugAndType("blogs", SeoType.PAGE);

  const title = seo?.og_ttile || "Blogs & Articles";

  const description =
    seo?.og_description ||
    "Explore articles, tutorials, experiences, and insights.";

  const image = seo?.og_image || undefined;

  const keywords = seo?.keywords
    ? seo.keywords
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter(Boolean)
    : undefined;

  const canonicalUrl = `${baseUrl}/blogs`;

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
      type: "website",
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
