
"use client";

import Image from "next/image";
import { Controller } from "react-hook-form";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useTestimonialForm } from "../_hooks/useTestimonialForm";
import { TestimonialFormSkeleton } from "./form-skeleton";

export default function TestimonialForm() {
  const {
    form,
    isEdit,
    loading,
    isLoadingPage,
    isSubmitting,
    preview,
    handleAvatarChange,
    removeAvatar,
    onSubmit,
  } = useTestimonialForm();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  if (isLoadingPage) {
    return <TestimonialFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full space-y-6 py-5">
      {/* Name and Position */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>

          <Input
            id="name"
            placeholder="Enter person name"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            Position <span className="text-red-500">*</span>
          </Label>

          <Input
            id="position"
            placeholder="e.g. CEO, Software Engineer"
            {...register("position")}
          />

          {errors.position && (
            <p className="text-sm text-red-500">
              {errors.position.message}
            </p>
          )}
        </div>
      </div>

      {/* Company and Order */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">
            Company <span className="text-red-500">*</span>
          </Label>

          <Input
            id="company"
            placeholder="Enter company name"
            {...register("company")}
          />

          {errors.company && (
            <p className="text-sm text-red-500">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">
            Display Order <span className="text-red-500">*</span>
          </Label>

          <Controller
            name="order"
            control={control}
            render={({ field }) => (
              <Input
                id="order"
                type="number"
                min={1}
                placeholder="Enter display order"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value == null ? "" : String(field.value)}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
              />
            )}
          />

          {errors.order && (
            <p className="text-sm text-red-500">{errors.order.message}</p>
          )}
        </div>
      </div>

      {/* Testimonial */}
      <div className="space-y-2">
        <Label htmlFor="testimonial">
          Testimonial <span className="text-red-500">*</span>
        </Label>

        <Textarea
          id="testimonial"
          placeholder="Enter testimonial..."
          rows={6}
          {...register("testimonial")}
        />

        {errors.testimonial && (
          <p className="text-sm text-red-500">
            {errors.testimonial.message}
          </p>
        )}
      </div>

      {/* Active Testimonial */}
      <div className="flex items-center gap-3 pt-2">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <input
              id="isActive"
              type="checkbox"
              name={field.name}
              ref={field.ref}
              checked={Boolean(field.value)}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.checked)}
              disabled={isSubmitting || loading}
              className="h-4 w-4 rounded border-gray-300"
            />
          )}
        />

        <Label htmlFor="isActive" className="cursor-pointer">
          Active Testimonial
        </Label>
      </div>

      {/* Avatar */}
      <div className="space-y-3">
        <Label htmlFor="testimonial-avatar">Avatar</Label>

        {preview ? (
          <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Testimonial avatar preview"
              fill
              sizes="160px"
              unoptimized={preview.startsWith("data:")}
              className="object-cover"
            />

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={removeAvatar}
              aria-label="Remove testimonial avatar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="testimonial-avatar"
            className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed hover:bg-muted"
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Upload avatar
            </span>

            <span className="text-center text-xs text-muted-foreground">
              PNG, JPG, WEBP (Max 5 MB)
            </span>
          </label>
        )}

        <Input
          id="testimonial-avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            handleAvatarChange(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading || isSubmitting}>
        {loading || isSubmitting
          ? "Please wait..."
          : isEdit
            ? "Update Testimonial"
            : "Create Testimonial"}
      </Button>
    </form>
  );
}
