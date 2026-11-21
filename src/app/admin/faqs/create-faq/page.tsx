
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateFAQ = dynamic(() =>
  import("./_components").then((mod) => mod.CreateFAQ)
);

export default function CreateFAQPage() {
  return (
    <Suspense fallback={null}>
      <CreateFAQ />
    </Suspense>
  );
}
