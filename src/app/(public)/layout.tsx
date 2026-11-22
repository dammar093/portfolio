import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#18181B]">
      <Header />

      <main className="w-full flex-1 py-8 md:py-12">
        <Container>{children}</Container>
      </main>

      <Footer />
    </div>
  );
}
