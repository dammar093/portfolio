
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateLanguage = dynamic(() =>
  import("./_components").then((mod) => mod.CreateLanguage)
);

export default function CreateLanguagePage() {
  return (
    <Suspense fallback={null}>
      <CreateLanguage />
    </Suspense>
  );
}
