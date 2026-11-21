import dynamic from "next/dynamic";
import { Suspense } from "react";

const Seo = dynamic(() => import("./_components").then((mod) => mod.Seo));

const SettingSeoPage = () => {
  return (
    <Suspense fallback={null}>
      <Seo />
    </Suspense>
  );
};

export default SettingSeoPage;
