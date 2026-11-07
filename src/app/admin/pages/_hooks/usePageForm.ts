"use client";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";
import {
  PageCreateFormData,
  PageFormData,
  pageFormSchema,
} from "../_schema/page-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createPage, updatePage } from "../_redux/page-thunk";
import { usePages } from "./usePageList";

export const usePageForm = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.pages);

  const router = useRouter();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const { currentPage } = usePages(id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      short_title: "",
      description: "",
      slug: "",
      order: 1,
      image: undefined,
    },
  });

  /* Populate on edit */
  useEffect(() => {
    if (!currentPage) return;

    form.reset({
      title: currentPage.title ?? "",
      short_title: currentPage.short_title ?? "",
      description: currentPage.description ?? "",
      order: currentPage.order ?? 1,
      image: undefined,
    });

    if (currentPage.image) {
      setImagePreview((prev) => prev ?? currentPage.image);
    }
  }, [currentPage, form]);

  /* Submit */
  const onSubmit = useCallback(
    async (data: PageFormData) => {
      setIsSubmitting(true);
      try {
        if (isEdit && id) {
          const { title, short_title, description, order, image } = data;
          await dispatch(
            updatePage({
              id,
              data: { title, short_title, description, order, image },
            })
          ).unwrap();
        } else {
          if (!data.slug) {
            form.setError("slug", {
              type: "required",
              message: "Choose a page slug",
            });
            return;
          }

          await dispatch(
            createPage({
              ...data,
              slug: data.slug,
            } satisfies PageCreateFormData)
          ).unwrap();
        }

        form.reset();
        router.push("/admin/pages");
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, id, isEdit, router, form]
  );

  /* Image handlers */
  const handleImageChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (file: File | undefined) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      onChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const removeImage = useCallback(
    (onChange: (value: undefined) => void) => {
      onChange(undefined);
      setImagePreview(null);
    },
    []
  );

  return {
    form,
    loading,
    isLoadingPage: isEdit && loading && currentPage?.id !== id,
    isSubmitting,
    imagePreview,
    isEdit,
    onSubmit,
    handleImageChange,
    removeImage,
  };
};
