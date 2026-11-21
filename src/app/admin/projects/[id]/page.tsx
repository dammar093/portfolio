import dynamic from "next/dynamic";
import { Suspense } from "react";

const Edit = dynamic(() => import("./_components").then((mod) => mod.Edit));

const EditProjectPage = () => {
  return (
    <Suspense fallback={null}>
      <Edit />
    </Suspense>
  );
};

export default EditProjectPage;
