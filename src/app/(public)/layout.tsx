import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import RootProvider from "@/components/provider/RootProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <Container className="flex flex-col min-h-screen gap-10 ">
        <Header />
        {children}
        <Footer />
      </Container>
    </RootProvider>
  );
}
