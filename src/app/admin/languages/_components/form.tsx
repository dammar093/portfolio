"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { LoaderCircle, Upload, X } from "lucide-react";

import Image from "next/image";
import { Controller } from "react-hook-form";

import { useLanguageForm } from "../_hooks/useLanguageForm";
import { LanguageFormSkeleton } from "./form-skeleton";

const LanguageForm = () => {
  const {
    onSubmit,
    form,
    imagePreview,
    isEdit,
    isLoadingPage,
    isSubmitting,
    handleImageChange,
    removeImage,
  } = useLanguageForm();

  if (isLoadingPage) {
    return <LanguageFormSkeleton isEdit={isEdit} />;
  }

  return (
    <div className="mx-auto w-full py-5">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Language Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Language Name
                    <span className="text-red-400">*</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter language name"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            {/* Display Order */}
            <Controller
              name="order"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="order">
                    Display Order
                    <span className="text-red-400">*</span>
                  </FieldLabel>

                  <Input
                    id="order"
                    type="number"
                    min={1}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={
                      typeof field.value === "number" ||
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Enter display order"
                    disabled={isSubmitting}
                  />

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Language Image */}
          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="image">
                  Language Image
                  {!isEdit && <span className="text-red-400">*</span>}
                </FieldLabel>

                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative aspect-[3/2] w-72 overflow-hidden rounded-lg border">
                      <Image
                        fill
                        sizes="288px"
                        src={imagePreview}
                        alt="Language image preview"
                        className="object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(field.onChange)}
                        disabled={isSubmitting}
                        aria-label="Remove language image"
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image"
                      className="flex h-32 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-accent"
                    >
                      <Upload className="mb-2 h-8 w-8 text-gray-500" />

                      <span className="text-sm text-gray-500">
                        Click to upload image
                      </span>

                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          handleImageChange(event, field.onChange)
                        }
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Upload a language image. Maximum file size: 5 MB.
                </p>
              </Field>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-fit min-w-24"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                <span role="status" aria-live="polite">
                  Saving...
                </span>
              </>
            ) : (
              <>
                <span>
                  {isEdit ? "Update Language/Tool" : "Create Language/Tool"}
                </span>
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default LanguageForm;
