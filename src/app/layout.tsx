import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import ThemeProvider from "@/components/provider/ThemeProvider";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dammar",
  description:
    "I'm a software engineer with a passion for building web applications. I love to learn new technologies and improve my skills.",
  keywords:
    "Dammar Singh Rana, software engineer, web developer, full stack developer, JavaScript, TypeScript, React, Next.js, Node.js, Express.js, MongoDB, dyams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200 dark:bg-[#18181B] text-gray-800 dark:text-gray-200 font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Container className="flex flex-col min-h-screen gap-10 ">
            <Header />
            {children}
            <Footer />
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
