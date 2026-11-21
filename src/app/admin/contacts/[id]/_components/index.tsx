"use client";
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import ViewContact from "../../_components/view-contact";

export const View = () => {

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <ViewContact />
    </div>
  );
};
