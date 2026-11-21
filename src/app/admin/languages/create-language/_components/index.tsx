
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import LanguageForm from "../../_components/form";

export const CreateLanguage = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <LanguageForm />
    </div>
  );
};

export default CreateLanguage;
