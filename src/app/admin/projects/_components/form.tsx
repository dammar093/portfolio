
"use client";

import { BaseTextEditor } from "@/components/admin/shared/text-editor";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  File,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import Image from "next/image";

import { Controller } from "react-hook-form";

import { useProjectForm } from "../_hooks/useProjectForm";

import { ProjectFormSkeleton } from "./form-skeleton";

const ProjectForm = () => {
  const {
    onSubmit,
    form,
    imagePreview,
    isEdit,
    isLoadingProject,
    isSubmitting,
    handleImageChange,
    removeImage,
    handleSlugChange,
    languages,
    languagesLoading,
  } = useProjectForm();

  // ==========================================
  // SKELETON ONLY WHILE FETCHING EDIT PROJECT
  // ==========================================
  if (isEdit && isLoadingProject) {
    return <ProjectFormSkeleton isEdit={isEdit} />;
  }

  return (
    <div className="mx-auto w-full py-5">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>

          {/* ================================== */}
          {/* TITLE */}
          {/* ================================== */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">
                  Title
                  <span className="text-red-400">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter project title"
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

          {/* ================================== */}
          {/* SLUG */}
          {/* ================================== */}
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">
                  Project slug
                  <span className="text-red-400">*</span>
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
                  placeholder="Enter project slug"
                  disabled={isSubmitting}
                />

                <p className="text-xs text-muted-foreground">
                  {isEdit
                    ? "You can manually update the project slug."
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

          {/* ================================== */}
          {/* IMAGE */}
          {/* ================================== */}
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
                        alt="Project image preview"
                        className="object-cover"
                        unoptimized={imagePreview.startsWith("data:")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(field.onChange)
                        }
                        disabled={isSubmitting}
                        aria-label="Remove project image"
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 disabled:opacity-50"
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

          {/* ================================== */}
          {/* PROJECT LINK */}
          {/* ================================== */}
          <Controller
            name="link"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="link">
                  Project Link
                  <span className="text-red-400">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  id="link"
                  type="url"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com"
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

          {/* ================================== */}
          {/* LANGUAGES */}
          {/* ================================== */}
          <Controller
            name="languageIds"
            control={form.control}
            render={({ field, fieldState }) => {
              const activeLanguages = (
                languages ?? []
              ).filter((language) => language.isActive);

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Project Languages
                  </FieldLabel>

                  <div className="grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {languagesLoading ? (
                      <p className="text-sm text-muted-foreground">
                        Loading languages...
                      </p>
                    ) : activeLanguages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No active languages available. Create a language first.
                      </p>
                    ) : (
                      activeLanguages.map((language) => {
                        const checked = (
                          field.value ?? []
                        ).includes(language.id);

                        return (
                          <label
                            key={language.id}
                            className="flex cursor-pointer items-center gap-2 rounded-md border p-3 transition-colors hover:bg-accent"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                const currentIds =
                                  field.value ?? [];

                                field.onChange(
                                  event.target.checked
                                    ? [
                                        ...currentIds,
                                        language.id,
                                      ]
                                    : currentIds.filter(
                                        (id) =>
                                          id !== language.id
                                      )
                                );
                              }}
                              onBlur={field.onBlur}
                              disabled={isSubmitting}
                              className="size-4 cursor-pointer rounded border"
                            />

                            <span className="text-sm font-medium">
                              {language.name}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Select the languages and technologies used in this project.
                  </p>

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              );
            }}
          />

          {/* ================================== */}
          {/* DESCRIPTION */}
          {/* ================================== */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Description
                  <span className="text-red-400">*</span>
                </FieldLabel>

                <BaseTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* ================================== */}
          {/* ORDER */}
          {/* ================================== */}
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
                  value={field.value ?? 1}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? 1
                        : Number(event.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter display order"
                  disabled={isSubmitting}
                />

                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first.
                </p>

                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* ================================== */}
          {/* STATUS */}
          {/* ================================== */}
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
                    checked={field.value ?? false}
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

          {/* ================================== */}
          {/* SERVER ERROR */}
          {/* ================================== */}
          {form.formState.errors.root?.serverError?.message && (
            <p
              role="alert"
              className="text-sm text-red-500"
            >
              {form.formState.errors.root.serverError.message}
            </p>
          )}

          {/* ================================== */}
          {/* SUBMIT BUTTON */}
          {/* ================================== */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-fit min-w-32"
            disabled={isSubmitting || isLoadingProject}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />

                <span>
                  {isEdit
                    ? "Updating..."
                    : "Creating..."}
                </span>
              </>
            ) : (
              <>
                <span>
                  {isEdit
                    ? "Update Project"
                    : "Create Project"}
                </span>

                <File className="size-4" />
              </>
            )}
          </Button>

        </FieldGroup>
      </form>
    </div>
  );
};

export default ProjectForm;
