
"use client";

import { BaseTextEditor } from "@/components/admin/shared/text-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  File,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";

import { useBlogForm } from "../_hooks/useBlogForm";
import { BlogFormSkeleton } from "./form-skeleton";

const BlogForm = () => {
  const {
    onSubmit,
    form,
    imagePreview,
    isEdit,
    isLoadingBlog,
    isSubmitting,
    handleImageChange,
    removeImage,
    handleSlugChange,
  } = useBlogForm();

  if (isLoadingBlog) {
    return <BlogFormSkeleton isEdit={isEdit} />;
  }

  return (
    <div className="mx-auto w-full py-5">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* TITLE */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">
                  Title<span className="text-red-400">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter blog title"
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

          {/* SLUG */}
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">
                  Blog slug<span className="text-red-400">*</span>
                </FieldLabel>

                <Input
                  id="slug"
                  name={field.name}
                  ref={field.ref}
                  value={field.value || ""}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    handleSlugChange(event.target.value)
                  }
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter blog slug"
                  disabled={isSubmitting}
                />

                <p className="text-xs text-muted-foreground">
                  {isEdit
                    ? "You can manually update the blog slug."
                    : "Slug is generated automatically from the title. You can also edit it manually."}
                </p>

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* IMAGE */}
          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="image">
                  Image
                  {!isEdit && (
                    <span className="text-red-400">*</span>
                  )}
                </FieldLabel>

                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative aspect-[3/2] w-72 overflow-hidden rounded-lg border">
                      <Image
                        fill
                        sizes="288px"
                        src={imagePreview}
                        alt="Blog image preview"
                        className="object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(field.onChange)}
                        disabled={isSubmitting}
                        aria-label="Remove blog image"
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
                          handleImageChange(
                            event,
                            field.onChange
                          )
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
              </Field>
            )}
          />

          {/* DESCRIPTION */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Description
                  <span className="text-red-400">*</span>
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

          {/* STATUS */}
          <Controller
            name="isActive"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="isActive">
                  Status
                </FieldLabel>

                <label className="flex items-center gap-2">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) =>
                      field.onChange(event.target.checked)
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    disabled={isSubmitting}
                    className="size-4 cursor-pointer rounded border"
                  />

                  <span className="text-sm text-muted-foreground">
                    Active
                  </span>
                </label>

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* SUBMIT */}
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
                <span>{isEdit ? "Update" : "Save"}</span>
                <File />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default BlogForm;
