
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import ExperienceForm from "../../_components/form";

export const CreateExperience = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ExperienceForm />
    </div>
  );
};

export default CreateExperience;
