import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { PagesTable } from "./table";

export const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <PagesTable />
    </div>
  );
};
