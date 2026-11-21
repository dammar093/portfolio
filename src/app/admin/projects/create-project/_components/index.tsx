import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import ProjectForm from "../../_components/form";

export const CreateProject = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ProjectForm />
    </div>
  );
};
