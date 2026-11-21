import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { ProjectsTable } from "./table";

export const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ProjectsTable />
    </div>
  );
};
