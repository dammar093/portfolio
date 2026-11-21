
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { FAQsTable } from "./table";

export const FAQs = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <FAQsTable />
    </div>
  );
};

export default FAQs;
