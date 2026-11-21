import dynamic from "next/dynamic";
import { Suspense } from "react";

const Page = dynamic(() => import("./_components").then((mod) => mod.Page));

const ProjectsPage = () => {
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
};

export default ProjectsPage;
