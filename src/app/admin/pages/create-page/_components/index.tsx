import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import PageForm from "../../_components/form";

export const CreatePage = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <PageForm />
    </div>
  );
};
