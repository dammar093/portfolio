import { baseUrl, fetchPageBySlug, fetchSeoBySlugAndType } from "@/api/api";
import FaqSection from "@/components/FaqsSection";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import type { SeoItem } from "@/types/seo-type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const About = async () => {
  const page = await fetchPageBySlug("about");

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
            <div
              dangerouslySetInnerHTML={{
                __html: page.description || "",
              }}
            />
          </article>
        </div>

        {/* FAQs */}
        <div className="mx-auto w-full max-w-5xl pb-8">
          <FaqSection />
        </div>
      </section>
    </>
  );
};

export default About;

// Generate SEO metadata
export async function generateMetadata(): Promise<Metadata> {
  const seo: SeoItem | null = await fetchSeoBySlugAndType(
    "about",
    SeoType.PAGE,
  );

  const title = seo?.og_ttile || "About Me";
  const description = seo?.og_description || "";
  const keywords = seo?.keywords
    ? seo.keywords.split(",").map((keyword) => keyword.trim())
    : undefined;
  const image = seo?.og_image || "";

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: "website",
      url: `${baseUrl}/about`,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },

    alternates: {
      canonical: `${baseUrl}/about`,
    },
  };
}
