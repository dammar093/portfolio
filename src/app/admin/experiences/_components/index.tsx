
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { ExperiencesTable } from "./table";

export const Experience = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ExperiencesTable />
    </div>
  );
};

export default Experience;
