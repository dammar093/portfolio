import { baseUrl, fetchSeoSettings } from "@/api/api";
import RootProvider from "@/components/provider/RootProvider";
import { SeoItem } from "@/types/seo-type";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200 dark:bg-[#18181B] text-gray-800 dark:text-gray-200`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const seo: SeoItem | null = await fetchSeoSettings();

  const title = seo?.og_ttile || "Dammar Singh Rana | Software Engineer";

  const description =
    seo?.og_description ||
    "I'm a software engineer with a passion for building web applications. I love to learn new technologies and improve my skills.";

  const image = seo?.og_image || undefined;

  const favicon = seo?.og_image || "";

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
