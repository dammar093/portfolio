
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { ServicesTable } from "./table";

export const Service = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ServicesTable />
    </div>
  );
};

export default Service;
