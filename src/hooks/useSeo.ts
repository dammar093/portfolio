"use client";

import { SeoType } from "@/generated/prisma/enums";

import { fetchSeo, updateSeo } from "@/redux/thunk/seo-thunk";
import { SeoUpdateFormData, seoUpdateSchema } from "@/schema/seo-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelectore";

interface UseSeoProps {
  id: string;
  seoType: SeoType;
}

const formatSchemaMarkup = (schemaMarkup: unknown): string => {
  if (!schemaMarkup) return "";

  if (typeof schemaMarkup === "string") {
    try {
      return JSON.stringify(JSON.parse(schemaMarkup), null, 2);
    } catch {
      return schemaMarkup;
    }
  }

  try {
    return JSON.stringify(schemaMarkup, null, 2);
  } catch {
    return "";
  }
};

export const useSeo = ({ id, seoType }: UseSeoProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, saving, item, error } = useAppSelector(
    (state) => state.seo,
  );

  const isEdit = Boolean(id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SeoUpdateFormData>({
    resolver: zodResolver(seoUpdateSchema),
    defaultValues: {
      og_ttile: "",
      og_description: "",
      keywords: "",
      og_image: undefined,
      schema_markup: "",
    },
  });

  /* ---------------- Fetch SEO ---------------- */

  useEffect(() => {
    if (!id) return;

    dispatch(
      fetchSeo({
        relatedId: id,
        seoType,
      }),
    );
  }, [dispatch, id, seoType]);

  /* ---------------- Hydrate Form ---------------- */

  useEffect(() => {
    if (!item) return;

    form.reset({
      og_ttile: item.og_ttile ?? "",
      og_description: item.og_description ?? "",
      keywords: item.keywords ?? "",
      og_image: undefined,
      schema_markup: formatSchemaMarkup(item.schema_markup),
    });

    setImagePreview(item.og_image ?? null);
  }, [item, form]);

  /* ---------------- Submit ---------------- */

  const onSubmit = useCallback(
    async (data: SeoUpdateFormData) => {
      if (!id) return;

      try {
        await dispatch(
          updateSeo({
            relatedId: id,
            seoType,
            data,
          }),
        ).unwrap();

        router.back();
      } catch (submitError) {
        console.error("Failed to update SEO:", submitError);
      }
    },
    [dispatch, id, seoType, router],
  );

  /* ---------------- Image Change ---------------- */

  const handleImageChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      onChange: (file: File | undefined) => void,
    ) => {
      const file = event.target.files?.[0];

      if (!file) return;

      onChange(file);

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };

      reader.readAsDataURL(file);
    },
    [],
  );

  /* ---------------- Remove Image ---------------- */

  const removeImage = useCallback(
    (onChange: (file: File | undefined) => void) => {
      onChange(undefined);
      setImagePreview(null);

      form.setValue("og_image", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  return {
    form,
    loading,
    saving,
    error,
    item,
    isEdit,
    imagePreview,
    onSubmit,
    handleImageChange,
    removeImage,
  };
};
