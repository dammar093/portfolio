"use client";
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import SeoForm from "@/components/admin/shared/seo-form";
import { SeoType } from "@/generated/prisma/enums";
import { useParams } from "next/navigation";

export const Seo = () => {
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <SeoForm id={id as string} seoType={SeoType.PAGE} />
    </div>
  );
};
