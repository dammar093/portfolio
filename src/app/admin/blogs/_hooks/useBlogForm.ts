"use client";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import {
  BlogCreateFormData,
  BlogFormData,
  blogFormSchema,
} from "../_schema/blog-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { createBlog, updateBlog } from "../_redux/blog-thunk";
import { useBlogs } from "./useBlogList";

// Convert title into URL-friendly slug
const generateSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const useBlogForm = () => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.blogs);

  const router = useRouter();
  const params = useParams<{ id?: string }>();

  const id = typeof params.id === "string" ? params.id : undefined;
  const isEdit = Boolean(id);

  const { currentBlog } = useBlogs(id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracks whether the user manually changed the slug
  const slugManuallyEdited = useRef(false);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      isActive: true,
      image: undefined,
    },
  });

  const title = useWatch({
    control: form.control,
    name: "title",
  });

  // ==============================
  // AUTO GENERATE SLUG ON CREATE
  // ==============================
  useEffect(() => {
    if (isEdit || slugManuallyEdited.current) return;

    const generatedSlug = generateSlug(title || "");

    form.setValue("slug", generatedSlug, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [title, isEdit, form]);

  // ==============================
  // MANUAL SLUG CHANGE
  // ==============================
  const handleSlugChange = useCallback(
    (value: string) => {
      slugManuallyEdited.current = true;

      form.setValue("slug", value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  // ==============================
  // POPULATE FORM ON EDIT
  // ==============================
  useEffect(() => {
    if (!isEdit || !id || !currentBlog || currentBlog.id !== id) {
      return;
    }

    form.reset({
      title: currentBlog.title ?? "",
      slug: currentBlog.slug ?? "",
      description: currentBlog.description ?? "",
      isActive: currentBlog.isActive ?? true,
      image: undefined,
    });

    // Never auto-generate slug while editing
    slugManuallyEdited.current = true;

    setImagePreview(currentBlog.image ?? null);
  }, [currentBlog, id, isEdit, form]);

  // ==============================
  // SUBMIT FORM
  // ==============================
  const onSubmit = useCallback(
    async (data: BlogFormData) => {
      setIsSubmitting(true);

      try {
        if (isEdit && id) {
          await dispatch(
            updateBlog({
              id,
              data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                isActive: data.isActive,
                image: data.image instanceof File ? data.image : undefined,
              },
            }),
          ).unwrap();
        } else {
          if (!(data.image instanceof File)) {
            form.setError("image", {
              type: "required",
              message: "Blog image is required",
            });

            return;
          }

          await dispatch(
            createBlog({
              ...data,
              image: data.image,
            } satisfies BlogCreateFormData),
          ).unwrap();
        }

        form.reset();
        setImagePreview(null);

        router.replace("/admin/blogs");
        router.refresh();
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, id, isEdit, router, form],
  );

  // ==============================
  // IMAGE CHANGE
  // ==============================
  const handleImageChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (file: File | undefined) => void,
    ) => {
      const file = e.target.files?.[0];

      if (!file) return;

      onChange(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };

      reader.readAsDataURL(file);
    },
    [],
  );

  // ==============================
  // REMOVE IMAGE
  // ==============================
  const removeImage = useCallback(
    (onChange: (value: undefined) => void) => {
      onChange(undefined);
      setImagePreview(null);
    },
    [],
  );

  return {
    form,
    loading,

    isLoadingBlog:
      isEdit && (loading || !currentBlog || currentBlog.id !== id),

    isSubmitting,
    imagePreview,
    isEdit,

    onSubmit,
    handleImageChange,
    removeImage,
    handleSlugChange,
  };
};