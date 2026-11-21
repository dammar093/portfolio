
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import FAQForm from "../../_components/form";

export const CreateFAQ = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <FAQForm />
    </div>
  );
};

export default CreateFAQ;
