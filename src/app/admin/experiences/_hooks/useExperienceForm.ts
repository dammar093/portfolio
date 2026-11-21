
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { experienceCreateSchema } from "../_schema/experience-schema";

import {
  createExperience,
  updateExperience,
} from "../_redux/experience-thunk";

import { useExperiences } from "./useExperienceList";

// ==============================
// FORM TYPES
// ==============================
type ExperienceFormInput = z.input<
  typeof experienceCreateSchema
>;

type ExperienceFormOutput = z.output<
  typeof experienceCreateSchema
>;

// ==============================
// EXPERIENCE FORM HOOK
// ==============================
export function useExperienceForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const id =
    typeof params.id === "string" ? params.id : undefined;

  const isEdit = Boolean(id);

  const { currentExperience, loading } = useAppSelector(
    (state) => state.experiences
  );

  // Fetch experience when editing
  useExperiences(id);

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==============================
  // REACT HOOK FORM
  // ==============================
  const form = useForm<
    ExperienceFormInput,
    unknown,
    ExperienceFormOutput
  >({
    resolver: zodResolver(experienceCreateSchema),
    defaultValues: {
      company: "",
      position: "",
      employmentType: "FULL_TIME",
      location: "",
      description: "",
      joinDate: new Date(),
      leaveDate: null,
      isCurrent: false,
      order: 1,
      isActive: true,
      image: null,
    },
  });

  // ==============================
  // SET EDIT FORM VALUES
  // ==============================
  useEffect(() => {
    if (
      !isEdit ||
      !currentExperience ||
      currentExperience.id !== id
    ) {
      return;
    }

    form.reset({
      company: currentExperience.company ?? "",
      position: currentExperience.position ?? "",
      employmentType: currentExperience.employmentType,
      location: currentExperience.location ?? "",
      description: currentExperience.description ?? "",
      joinDate: currentExperience.joinDate
        ? new Date(currentExperience.joinDate)
        : new Date(),
      leaveDate: currentExperience.leaveDate
        ? new Date(currentExperience.leaveDate)
        : null,
      isCurrent: currentExperience.isCurrent ?? false,
      order: currentExperience.order ?? 1,
      isActive: currentExperience.isActive ?? true,
      image: null,
    });

    setPreview(currentExperience.image ?? null);
  }, [currentExperience, id, isEdit, form]);

  // ==============================
  // LOADING STATE
  // ==============================
  const isLoadingPage =
    isEdit &&
    (loading ||
      !currentExperience ||
      currentExperience.id !== id);

  // ==============================
  // IMAGE CHANGE
  // ==============================
  const handleImageChange = (file?: File) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPEG, PNG, or WEBP image");
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
  // CURRENT EMPLOYMENT CHANGE
  // ==============================
  const handleCurrentChange = (checked: boolean) => {
    form.setValue("isCurrent", checked, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (checked) {
      form.setValue("leaveDate", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // ==============================
  // SUBMIT FORM
  // ==============================
  const onSubmit = async (values: ExperienceFormOutput) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload = {
        company: values.company,
        position: values.position,
        employmentType: values.employmentType,
        location: values.location,
        description: values.description,
        joinDate: values.joinDate,
        leaveDate: values.isCurrent
          ? null
          : values.leaveDate ?? null,
        isCurrent: values.isCurrent,
        order: values.order,
        isActive: values.isActive,
        image: values.image ?? null,
      };

      if (isEdit && id) {
        await dispatch(
          updateExperience({
            id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(
          createExperience(payload)
        ).unwrap();
      }

      router.push("/admin/experiences");
      router.refresh();
    } catch (error) {
      console.error(
        "Experience form submission failed:",
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================
  // RETURN
  // ==============================
  return {
    form,
    isEdit,
    loading,
    isSubmitting,
    isLoadingPage,
    preview,
    handleImageChange,
    removeImage,
    handleCurrentChange,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
