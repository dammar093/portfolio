"use client";

import { BaseTextEditor } from "@/components/admin/shared/text-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { File, LoaderCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { usePageForm } from "../_hooks/usePageForm";
import { PageFormSkeleton } from "./page-form-skaleton";

const PageForm = () => {
  const {
    onSubmit,
    form,
    imagePreview,
    isEdit,
    isLoadingPage,
    isSubmitting,
    availableSlugs,
    areSlugsLoading,
    handleImageChange,
    removeImage,
  } = usePageForm();

  if (isLoadingPage) return <PageFormSkeleton isEdit={isEdit} />;

  return (
    <div className="mx-auto w-full py-5">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    placeholder="Enter page title"
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

            <Controller
              name="short_title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="short_title">
                    Short title<span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="short_title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter short title"
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

          {!isEdit && (
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="slug">
                    Page slug<span className="text-red-400">*</span>
                  </FieldLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || areSlugsLoading}
                  >
                    <SelectTrigger
                      id="slug"
                      aria-invalid={fieldState.invalid}
                      ref={field.ref}
                      onBlur={field.onBlur}
                    >
                      <SelectValue
                        placeholder={
                          areSlugsLoading
                            ? "Loading available slugs..."
                            : "Choose a page slug"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlugs.map((slug) => (
                        <SelectItem value={slug} key={slug}>
                          {slug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!areSlugsLoading && availableSlugs.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      All page slugs are already in use.
                    </p>
                  )}
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          )}

           <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="image">
                    Image{!isEdit && <span className="text-red-400">*</span>}
                  </FieldLabel>
                  <div className="space-y-2">
                    {imagePreview ? (
                      <div className="relative aspect-[3/2] w-72 overflow-hidden rounded-lg border">
                        <Image
                          fill
                          sizes="288px"
                          src={imagePreview}
                          alt="Page image preview"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(field.onChange)}
                          disabled={isSubmitting}
                          aria-label="Remove page image"
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
                </Field>
              )}
          />
          
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
                <span>Save</span>
                <File />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default PageForm;
