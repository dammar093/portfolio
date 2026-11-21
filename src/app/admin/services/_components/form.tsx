"use client";

import Image from "next/image";
import { Controller } from "react-hook-form";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useServiceForm } from "../_hooks/useServiceForm";
import { ServiceFormSkeleton } from "./form-skeleton";
import { BaseTextEditor } from "@/components/admin/shared/text-editor";
import { Field, FieldLabel } from "@/components/ui/field";

export default function ServiceForm() {
  const {
    form,
    isEdit,
    loading,
    isLoadingPage,
    preview,
    handleImageChange,
    removeImage,
    onSubmit,
  } = useServiceForm();

  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  if (isLoadingPage) {
    return <ServiceFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full space-y-6 py-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Service Title <span className="text-red-500">*</span>
          </Label>

          <Input
            id="title"
            placeholder="Enter service title"
            {...register("title")}
          />

          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Order */}
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

      {/* Description */}

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">
              Description<span className="text-red-400">*</span>
            </FieldLabel>
            <BaseTextEditor {...field} />
            {fieldState.error && (
              <p className="mt-1 text-sm text-red-500">
                {fieldState.error.message}
              </p>
            )}
          </Field>
        )}
      />

      {/* Image */}
      <div className="space-y-3">
        <Label htmlFor="service-image">Service Image</Label>

        {preview ? (
          <div className="relative h-40 w-48 overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Service preview"
              fill
              sizes="192px"
              unoptimized={preview.startsWith("blob:")}
              className="object-cover"
            />

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={removeImage}
              aria-label="Remove service image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="service-image"
            className="flex h-40 w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed hover:bg-muted"
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">Upload image</span>

            <span className="text-xs text-muted-foreground">
              PNG, JPG, WEBP (Max 5 MB)
            </span>
          </label>
        )}

        <Input
          id="service-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            handleImageChange(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading || isSubmitting}>
        {loading || isSubmitting
          ? "Please wait..."
          : isEdit
            ? "Update Service"
            : "Create Service"}
      </Button>
    </form>
  );
}
