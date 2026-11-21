"use client";
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import SeoForm from "@/components/admin/shared/seo-form";
import { SeoType } from "@/generated/prisma/enums";

export const Seo = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <SeoForm id={"550e8400-e29b-41d4-a716-446655440000"} seoType={SeoType.SETTING} />
    </div>
  );
};
