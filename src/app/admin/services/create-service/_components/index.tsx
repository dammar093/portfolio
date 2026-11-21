
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import ServiceForm from "../../_components/form";

export const CreateService = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ServiceForm />
    </div>
  );
};

export default CreateService;
