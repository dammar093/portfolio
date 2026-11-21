
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { faqCreateSchema } from "../_schema/faq-schema";

import {
  createFAQ,
  updateFAQ,
} from "../_redux/faq-thunk";

import { useFAQs } from "./useFaqList";

// ==============================
// FORM SCHEMA
// ==============================
const faqFormSchema = faqCreateSchema;

type FAQFormInput = import("zod").input<typeof faqFormSchema>;
type FAQFormOutput = import("zod").output<typeof faqFormSchema>;

// ==============================
// FAQ FORM HOOK
// ==============================
export function useFAQForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const id = typeof params.id === "string" ? params.id : undefined;
  const isEdit = Boolean(id);

  const { currentFAQ, loading } = useAppSelector(
    (state) => state.faqs
  );

  // Fetch FAQ when editing
  useFAQs(id);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==============================
  // REACT HOOK FORM
  // ==============================
  const form = useForm<FAQFormInput, unknown, FAQFormOutput>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      order: 1,
      isActive: true,
    },
  });

  // ==============================
  // SET EDIT FORM VALUES
  // ==============================
  useEffect(() => {
    const faq = currentFAQ;

    if (!isEdit || !id || !faq || faq.id !== id) {
      return;
    }

    form.reset({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive ?? true,
    });
  }, [currentFAQ, id, isEdit, form]);

  // ==============================
  // LOADING STATE
  // ==============================
  const isLoadingPage =
    isEdit &&
    (loading || !currentFAQ || currentFAQ.id !== id);

  // ==============================
  // SUBMIT FORM
  // ==============================
  const onSubmit = async (values: FAQFormOutput) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload = {
        question: values.question,
        answer: values.answer,
        order: values.order,
        isActive: values.isActive,
      };

      if (isEdit && id) {
        await dispatch(
          updateFAQ({
            id,
            data: payload,
          })
        ).unwrap();

        toast.success("FAQ updated successfully");
      } else {
        await dispatch(createFAQ(payload)).unwrap();

        toast.success("FAQ created successfully");
      }

      router.push("/admin/faqs");
      router.refresh();
    } catch (error) {
      console.error("FAQ form submission failed:", error);
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
    onSubmit: form.handleSubmit(onSubmit),
  };
}
