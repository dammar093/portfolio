import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreatePage = dynamic(() =>
  import("./_components").then((mod) => mod.CreateBlog),
);

export default function CreateBlogPage() {
  return (
    <Suspense fallback={null}>
      <CreatePage />
    </Suspense>
  );
}
