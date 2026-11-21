import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import BlogForm from "../../_components/form";

export const CreateBlog = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <BlogForm />
    </div>
  );
};
