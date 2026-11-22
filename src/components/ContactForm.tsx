"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { createContact } from "@/api/api";
import {
  contactSchema,
  type ContactFormData,
} from "@/app/admin/contacts/_schema/contact-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inquiryOptions = [
  "General Inquiry",
  "Project Collaboration",
  "Website Development",
  "Frontend Development",
  "Backend Development",
  "Other",
];

const fieldClass =
  "rounded-xl px-4 focus-visible:border-teal-500 focus-visible:ring-teal-500/20";

type FieldWrapperProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

const FieldWrapper = ({ id, label, error, children }: FieldWrapperProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>
      {label} <span className="text-red-500">*</span>
    </Label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

const ContactForm = () => {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullname: "",
      email: "",
      forWhat: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus(null);

    try {
      const result = await createContact(data);

      setStatus({
        type: "success",
        message: result.message || "Your message has been sent successfully!",
      });
      reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send your message. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full name */}
        <Controller
          name="fullname"
          control={control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              id="fullname"
              label="Full Name"
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                id="fullname"
                type="text"
                placeholder="Your full name"
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "fullname-error" : undefined
                }
                className={fieldClass}
              />
            </FieldWrapper>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              id="email"
              label="Email Address"
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? "email-error" : undefined}
                className={fieldClass}
              />
            </FieldWrapper>
          )}
        />
      </div>

      {/* Inquiry type */}
      <Controller
        name="forWhat"
        control={control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            id="forWhat"
            label="What would you like to discuss?"
            error={fieldState.error?.message}
          >
            <Select
              value={field.value}
              onValueChange={field.onChange}
              name={field.name}
            >
              <SelectTrigger
                id="forWhat"
                onBlur={field.onBlur}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "forWhat-error" : undefined
                }
                className="h-11 w-full rounded-xl px-4 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              >
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                {inquiryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>
        )}
      />

      {/* Message */}
      <Controller
        name="message"
        control={control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            id="message"
            label="Your Message"
            error={fieldState.error?.message}
          >
            <Textarea
              {...field}
              id="message"
              rows={6}
              placeholder="Tell me about your project or inquiry..."
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.invalid ? "message-error" : undefined}
              className={`${fieldClass} min-h-36 resize-none py-3`}
            />
          </FieldWrapper>
        )}
      />

      {status && (
        <div
          role="alert"
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-400"
              : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send
              size={17}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;