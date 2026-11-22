import {
  baseUrl,
  fetchPageBySlug,
  fetchSeoBySlugAndType,
  fetchServices,
} from "@/api/api";
import { ServiceItem } from "@/app/admin/services/_types/service";
import ServiceCard from "@/components/ServcieCard";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import { SeoItem } from "@/types/seo-type";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const ServicesPage = async () => {
  const [page, services] = await Promise.all([
    fetchPageBySlug("services"),
    fetchServices(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <>
      {page.seo?.schema_markup && <JsonLd data={page.seo.schema_markup} />}

      <section className="flex h-full w-full flex-col gap-8 py-8">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <header className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-800">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-500 dark:text-indigo-400">
              {page.title}
            </p>
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

        {services.length > 0 ? (
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {services.map((service: ServiceItem) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="mx-auto w-full max-w-5xl py-12 text-center text-gray-500 dark:text-gray-400">
            No services found.
          </p>
        )}
      </section>
    </>
  );
};

export default ServicesPage;

export async function generateMetadata(): Promise<Metadata> {
  const seo: SeoItem = await fetchSeoBySlugAndType("services", SeoType.PAGE);

  if (!seo) {
  }
  const title = seo.og_ttile || "Services";
  const description = seo.og_description || "";
  const keywords = seo.keywords
    ? seo.keywords.split(",").map((keyword: string) => keyword.trim())
    : undefined;
  const image = seo.og_image || "";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },

    alternates: {
      canonical: `${baseUrl}/services`,
    },
  };
}
