"use client";

import { SeoType } from "@/generated/prisma/enums";

import { fetchSeo, updateSeo } from "@/redux/thunk/seo-thunk";
import { SeoUpdateFormData, seoUpdateSchema } from "@/schema/seo-schema";

import { htmlToString } from "@/lib/html-to-string";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import { useForm } from "react-hook-form";

import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelectore";

// =====================================
// TYPES
// =====================================

interface UseSeoProps {
  id: string;
  seoType: SeoType;
}

// =====================================
// FORMAT JSON SCHEMA MARKUP
// =====================================

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

// =====================================
// SEO HOOK
// =====================================

export const useSeo = ({ id, seoType }: UseSeoProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, saving, item, error } = useAppSelector((state) => state.seo);

  const isEdit = Boolean(id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // =====================================
  // FORM
  // =====================================

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

  // =====================================
  // FETCH SEO
  // =====================================

  useEffect(() => {
    if (!id) return;

    dispatch(
      fetchSeo({
        relatedId: id,
        seoType,
      }),
    );
  }, [dispatch, id, seoType]);

  // =====================================
  // HYDRATE FORM
  // =====================================

  useEffect(() => {
    if (!item) return;

    form.reset({
      og_ttile: item.og_ttile ?? "",

      // Convert HTML to readable plain text.
      og_description: htmlToString(item.og_description ?? ""),

      keywords: item.keywords ?? "",

      og_image: undefined,

      schema_markup: formatSchemaMarkup(item.schema_markup),
    });

    setImagePreview(item.og_image ?? null);
  }, [item, form]);

  // =====================================
  // SUBMIT
  // =====================================

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

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      onChange: (file: File | undefined) => void,
    ) => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        return;
      }

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

  // =====================================
  // REMOVE IMAGE
  // =====================================

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

  // =====================================
  // RETURN
  // =====================================

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
