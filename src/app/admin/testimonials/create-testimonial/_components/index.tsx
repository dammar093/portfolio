
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import TestimonialsForm from "../../_components/form";

export const CreateTestimonial = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <TestimonialsForm />
    </div>
  );
};

export default CreateTestimonial;
