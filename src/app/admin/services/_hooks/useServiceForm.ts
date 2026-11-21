
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { serviceCreateSchema } from "../_schema/service-schema";

import {
  createService,
  updateService,
} from "../_redux/service-thunk";

import { useServices } from "./useServiceList";

// ==============================
// FORM SCHEMA
// ==============================
const serviceFormSchema = serviceCreateSchema.extend({
  image: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" && value instanceof File,
      "Please select a valid image"
    )
    .nullable()
    .optional(),
});

type ServiceFormInput = z.input<typeof serviceFormSchema>;
type ServiceFormOutput = z.output<typeof serviceFormSchema>;

// ==============================
// SERVICE FORM HOOK
// ==============================
export function useServiceForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const id = typeof params.id === "string" ? params.id : undefined;
  const isEdit = Boolean(id);

  const {
    currentService,
    loading,
  } = useAppSelector((state) => state.services);

  // Fetch service when editing
  useServices(id);

  const [preview, setPreview] = useState<string | null | undefined >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==============================
  // REACT HOOK FORM
  // ==============================
  const form = useForm<
    ServiceFormInput,
    unknown,
    ServiceFormOutput
  >({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      image: null,
    },
  });

  // ==============================
  // SET EDIT FORM VALUES
  // ==============================
  useEffect(() => {
    if (isEdit && currentService?.id === id) {
      form.reset({
        title: currentService?.title,
        description: currentService?.description,
        order: currentService?.order,
        image: null,
      });

      setPreview(currentService?.image);
    }
  }, [currentService, id, isEdit, form]);

  // ==============================
  // LOADING STATE
  // ==============================
  const isLoadingPage =
    isEdit &&
    (loading || !currentService || currentService.id !== id);

  // ==============================
  // IMAGE CHANGE
  // ==============================
  const handleImageChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    form.setValue("image", file, {
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
  // REMOVE IMAGE
  // ==============================
  const removeImage = () => {
    form.setValue("image", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setPreview(null);
  };

  // ==============================
  // SUBMIT FORM
  // ==============================
  const onSubmit = async (values: ServiceFormOutput) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload = {
        title: values.title,
        description: values.description,
        order: values.order,
        image: values.image ?? null,
      };

      if (isEdit && id) {
        await dispatch(
          updateService({
            id,
            data: payload,
          })
        ).unwrap();

        toast.success("Service updated successfully");
      } else {
        await dispatch(createService(payload)).unwrap();

        toast.success("Service created successfully");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error("Service form submission failed:", error);
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
    handleImageChange,
    removeImage,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
