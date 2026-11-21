
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import { TestimonialsTable } from "./table";

export const Testimonials = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <TestimonialsTable />
    </div>
  );
};

export default Testimonials;
