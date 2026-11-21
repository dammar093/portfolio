
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { LanguagesTable } from "./table";

export const Language = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <LanguagesTable />
    </div>
  );
};

export default Language;
