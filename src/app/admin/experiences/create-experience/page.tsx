
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Create = dynamic(() =>
  import("./_components").then((mod) => mod.CreateExperience)
);

export default function CreateExperiencePage() {
  return (
    <Suspense fallback={null}>
      <Create />
    </Suspense>
  );
}
