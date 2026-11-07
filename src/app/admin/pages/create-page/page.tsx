import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreatePage = dynamic(() =>
  import("./_components").then((mod) => mod.CreatePage),
);

export default function CreatePagePage() {
  return (
    <Suspense fallback={null}>
      <CreatePage />
    </Suspense>
  );
}
