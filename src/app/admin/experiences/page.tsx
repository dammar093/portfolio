import dynamic from "next/dynamic";
import { Suspense } from "react";

const Page = dynamic(() => import("./_components").then((mod) => mod.Experience));

const PagesPage = () => {
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
};

export default PagesPage;
