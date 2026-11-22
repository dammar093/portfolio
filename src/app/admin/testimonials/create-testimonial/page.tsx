
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateService = dynamic(() =>
  import("./_components").then((mod) => mod.CreateTestimonial)
);

export default function CreateServicePage() {
  return (
    <Suspense fallback={null}>
      <CreateService />
    </Suspense>
  );
}
