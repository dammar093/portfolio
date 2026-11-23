
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { testimonialCreateSchema } from "../_schema/testimonial-schema";

import {
  createTestimonial,
  updateTestimonial,
} from "../_redux/testimonial-thunk";

import { useTestimonials } from "./useTestimonialsList";

// ==============================
// FORM SCHEMA
// ==============================
const testimonialFormSchema = testimonialCreateSchema.extend({
  avatar: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" && value instanceof File,
      "Please select a valid image"
    )
    .nullable()
    .optional(),
});

type TestimonialFormInput = z.input<typeof testimonialFormSchema>;
type TestimonialFormOutput = z.output<typeof testimonialFormSchema>;

// ==============================
// TESTIMONIAL FORM HOOK
// ==============================
export function useTestimonialForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const id = typeof params.id === "string" ? params.id : undefined;
  const isEdit = Boolean(id);

  const { currentTestimonial, loading } = useAppSelector(
    (state) => state.testimonials
  );

  // Fetch testimonial when editing
  useTestimonials(id);

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==============================
  // REACT HOOK FORM
  // ==============================
  const form = useForm<
    TestimonialFormInput,
    unknown,
    TestimonialFormOutput
  >({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      position: "",
      company: "",
      testimonial: "",
      order: 1,
      avatar: null,
      isActive: true,
    },
  });

  // ==============================
  // SET EDIT FORM VALUES
  // ==============================
  useEffect(() => {
    const testimonial = currentTestimonial;

    if (!isEdit || !id || !testimonial || testimonial.id !== id) {
      return;
    }

    form.reset({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      testimonial: testimonial.testimonial,
      order: testimonial.order,
      avatar: null,
      isActive: testimonial.isActive ?? true,
    });

    setPreview(testimonial.avatar);
  }, [currentTestimonial, id, isEdit, form]);

  // ==============================
  // LOADING STATE
  // ==============================
  const isLoadingPage =
    isEdit &&
    (loading ||
      !currentTestimonial ||
      currentTestimonial.id !== id);

  // ==============================
  // AVATAR CHANGE
  // ==============================
  const handleAvatarChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    form.setValue("avatar", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  // ==============================
  // REMOVE AVATAR
  // ==============================
  const removeAvatar = () => {
    form.setValue("avatar", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setPreview(null);
  };

  // ==============================
  // SUBMIT FORM
  // ==============================
  const onSubmit = async (values: TestimonialFormOutput) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        position: values.position,
        company: values.company,
        testimonial: values.testimonial,
        order: values.order,
        avatar: values.avatar ?? null,
        isActive: values.isActive,
      };

      if (isEdit && id) {
        await dispatch(
          updateTestimonial({
            id,
            data: payload,
          })
        ).unwrap();

      } else {
        await dispatch(createTestimonial(payload)).unwrap();
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (error) {
      console.error("Testimonial form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isEdit,
    loading,
    isSubmitting,
    isLoadingPage,
    preview,
    handleAvatarChange,
    removeAvatar,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
