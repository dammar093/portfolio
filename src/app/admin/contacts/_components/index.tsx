
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { ContactsTable } from "./table";

export const Contacts = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ContactsTable />
    </div>
  );
};

export default Contacts;
