import { baseUrl, fetchSeoSettings, fetchSetting } from "@/api/api";
import RootProvider from "@/components/provider/RootProvider";
import { SeoItem } from "@/types/seo-type";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { SettingItem } from "./admin/site-settings/_types/setting";
import { JsonLd } from "@/components/shared/JsonLoad";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [seo, setting]: [SeoItem | null, SettingItem] = await Promise.all([
    fetchSeoSettings(),
    fetchSetting(),
  ]);
  const googleTagId =
    typeof setting?.g_tag === "string" ? setting.g_tag.trim() : "";
  const isGoogleAnalyticsId = /^G-[A-Z0-9]+$/i.test(googleTagId);
  const isGoogleTagManagerId = /^GTM-[A-Z0-9]+$/i.test(googleTagId);

  return (
    <html lang="en">
      {seo?.schema_markup && <JsonLd data={seo?.schema_markup} />}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200 dark:bg-[#18181B]
        text-gray-800 dark:text-gray-200`}
      >
        <RootProvider>{children}</RootProvider>
        {isGoogleAnalyticsId && <GoogleAnalytics gaId={googleTagId} />}
        {isGoogleTagManagerId && <GoogleTagManager gtmId={googleTagId} />}
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const [seo, setting]: [SeoItem | null, SettingItem] = await Promise.all([
    fetchSeoSettings(),
    fetchSetting(),
  ]);
  const title = seo?.og_ttile || "Dammar Singh Rana | Software Engineer";

  const description =
    seo?.og_description ||
    "I'm a software engineer with a passion for building web applications. I love to learn new technologies and improve my skills.";

  const image = seo?.og_image || undefined;

  const favicon = setting?.logo || "";

  const keywords = seo?.keywords
    ? seo.keywords
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter(Boolean)
    : [
        "Dammar Singh Rana",
        "software engineer",
        "web developer",
        "full stack developer",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
      ];

  return {
    metadataBase: new URL(baseUrl),

    verification: {
      google: "GTdx_eR2LWn0-hweXHbQ3AVd8QFLFhmLg_cpzAhP5Lg",
    },

    title: {
      default: title,
      template: "%s | Dammar Singh Rana",
    },

    description,
    keywords,

    // Dynamic favicon
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },

    openGraph: {
      title,
      description,
      siteName: "Dammar Singh Rana",
      url: baseUrl,
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

    alternates: {
      canonical: baseUrl,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
