"use client";
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import FAqForm from "../../_components/form";

export const Edit = () => {

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <FAqForm />
    </div>
  );
};
