import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreatePage = dynamic(() =>
  import("./_components").then((mod) => mod.CreateProject),
);

export default function CreateProjectPage() {
  return (
    <Suspense fallback={null}>
      <CreatePage />
    </Suspense>
  );
}
