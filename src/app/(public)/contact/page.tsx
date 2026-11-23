import {
  baseUrl,
  fetchPageBySlug,
  fetchSeoBySlugAndType,
  fetchSetting,
} from "@/api/api";
import ContactForm from "@/components/ContactForm";
import { JsonLd } from "@/components/shared/JsonLoad";
import { SeoType } from "@/generated/prisma/enums";
import type { SeoItem } from "@/types/seo-type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Youtube,
} from "lucide-react";
import { SettingItem } from "@/app/admin/site-settings/_types/setting";
import type { LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const SOCIALS = [
  { key: "facebook_link", label: "Facebook", icon: Facebook },
  { key: "instagram_link", label: "Instagram", icon: Instagram },
  { key: "linkedin_link", label: "LinkedIn", icon: Linkedin },
  { key: "github_link", label: "GitHub", icon: Github },
  { key: "youtube_link", label: "YouTube", icon: Youtube },
] as const;

const Contact = async () => {
  const [page, setting] = (await Promise.all([
    fetchPageBySlug("contact"),
    fetchSetting(),
  ]))

  if (!page) notFound();

  const s = (setting ?? {}) as Partial<SettingItem>;
  const socials = SOCIALS.filter((item) => s[item.key]);

  const details = [
    s.email && {
      icon: Mail,
      label: "Email",
      value: s.email,
      href: `mailto:${s.email}`,
    },
    s.phone && {
      icon: Phone,
      label: "Phone",
      value: s.phone,
      href: `tel:${s.phone}`,
    },
    s.address && { icon: MapPin, label: "Location", value: s.address },
  ].filter(Boolean) as {
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <>
      {page.seo?.schema_markup && <JsonLd data={page.seo.schema_markup} />}

      <main className="py-10 md:py-14">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
          <div className="mx-auto w-full max-w-5xl space-y-8 py-8">
            <header className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-800">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-500 dark:text-teal-500">
                {page.title}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                {page.short_title}
              </h1>
            </header>

            <article className="rich-content max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: page.description || "" }}
              />
            </article>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left: info */}
            <aside className="flex flex-col gap-4 lg:col-span-2">
              {details.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {label}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {value}
                      </p>
                    </div>
                    {href && (
                      <ArrowUpRight
                        size={18}
                        className="ml-auto shrink-0 text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-500"
                      />
                    )}
                  </>
                );

                const cls =
                  "group flex items-center gap-4 rounded-2xl border border-gray-200 p-4 transition hover:border-teal-500/50 dark:border-white/10 dark:bg-white/[0.03]";

                return href ? (
                  <a key={label} href={href} className={cls}>
                    {content}
                  </a>
                ) : (
                  <div key={label} className={cls}>
                    {content}
                  </div>
                );
              })}

              {/* Socials, only if any exist */}
              {socials.length > 0 && (
                <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Find me on
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-3">
                    {socials.map(({ key, label, icon: Icon }) => (
                      <li key={key}>
                        <a
                          href={s[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          title={label}
                          className="flex size-11 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-teal-500 hover:bg-teal-500 hover:text-white dark:border-white/10 dark:text-gray-300"
                        >
                          <Icon size={18} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-200 p-6 dark:border-white/10 dark:bg-white/[0.03] md:p-8">
                <div className="mb-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
                    Contact form
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                    Send me a message
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
                    Fill in the details below and I&apos;ll get back to you
                    shortly.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;

export async function generateMetadata(): Promise<Metadata> {
  const seo: SeoItem | null = await fetchSeoBySlugAndType(
    "contact",
    SeoType.PAGE,
  );

  const title = seo?.og_ttile || "Contact Me";
  const description =
    seo?.og_description || "Get in touch and let's work together.";
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
      url: `${baseUrl}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: { canonical: `${baseUrl}/contact` },
  };
}
