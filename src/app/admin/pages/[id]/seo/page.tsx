import dynamic from "next/dynamic";
import { Suspense } from "react";

const Seo = dynamic(() => import("./_components").then((mod) => mod.Seo));

const PageSeoPage = () => {
  return (
    <Suspense fallback={null}>
      <Seo />
    </Suspense>
  );
};

export default PageSeoPage;
