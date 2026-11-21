
"use client";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { languageCreateSchema } from "../_schema/language-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createLanguage,
  updateLanguage,
} from "../_redux/language-thunk";

import { useLanguages } from "./useLanguageList";

// Form schema
const languageFormSchema = languageCreateSchema.extend({
  image: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" && value instanceof File,
      "Please select a valid image"
    )
    .nullable()
    .optional(),
});

// Separate input and output types
type LanguageFormInput = z.input<typeof languageFormSchema>;
type LanguageFormOutput = z.output<typeof languageFormSchema>;

export const useLanguageForm = () => {
  const dispatch = useAppDispatch();

  const { loading, currentLanguage } = useAppSelector(
    (state) => state.languages
  );

  const router = useRouter();
  const params = useParams<{ id?: string }>();

  const id = params?.id;
  const isEdit = Boolean(id);

  // Fetch language for edit
  useLanguages(id);

  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form
  const form = useForm<
    LanguageFormInput,
    unknown,
    LanguageFormOutput
  >({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      name: "",
      order: 1,
      image: null,
    },
  });

  // Populate form on edit
  useEffect(() => {
    if (!isEdit || !currentLanguage || currentLanguage.id !== id) {
      return;
    }

    form.reset({
      name: currentLanguage.name ?? "",
      order: currentLanguage.order ?? 1,
      image: null,
    });

    setImagePreview(currentLanguage.image ?? null);
  }, [currentLanguage, form, id, isEdit]);

  // Submit form
  const onSubmit = useCallback(
    async (data: LanguageFormOutput) => {
      setIsSubmitting(true);

      try {
        if (isEdit && id) {
          await dispatch(
            updateLanguage({
              id,
              data: {
                name: data.name,
                order: data.order,
                image: data.image,
              },
            })
          ).unwrap();
        } else {
          await dispatch(
            createLanguage({
              name: data.name,
              order: data.order,
              image: data.image,
            })
          ).unwrap();
        }

        form.reset();
        setImagePreview(null);

        router.replace("/admin/languages");
        router.refresh();
      } catch (error) {
        // Redux thunk handles the error and toast notification.
        console.error("Language submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, form, id, isEdit, router]
  );

  // Image selection
  const handleImageChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (file: File | null) => void
    ) => {
      const file = e.target.files?.[0];

      if (!file) return;

      // Validate image type
      if (!file.type.startsWith("image/")) {
        form.setError("image", {
          type: "manual",
          message: "Please select a valid image file",
        });

        e.target.value = "";
        return;
      }

      // Validate file size (5 MB)
      if (file.size > 5 * 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size must be less than 5 MB",
        });

        e.target.value = "";
        return;
      }

      form.clearErrors("image");
      onChange(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);

      // Allow selecting the same image again
      e.target.value = "";
    },
    [form]
  );

  // Remove selected image
  const removeImage = useCallback(
    (onChange: (value: File | null) => void) => {
      onChange(null);
      setImagePreview(null);
      form.clearErrors("image");
    },
    [form]
  );

  return {
    form,
    loading,

    isLoadingPage:
      isEdit &&
      (loading || !currentLanguage || currentLanguage.id !== id),

    isSubmitting,
    imagePreview,
    isEdit,

    onSubmit,
    handleImageChange,
    removeImage,
  };
};
