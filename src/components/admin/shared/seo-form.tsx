"use client";

import { File, Upload, X } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";

import { SeoType } from "@/generated/prisma/enums";
import { useSeo } from "@/hooks/useSeo";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SeoFormSkeleton } from "./seo-form-skaleton";
import { BaseTextEditor } from "./text-editor";

interface SeoFormProps {
  id: string;
  seoType: SeoType;
}

const schemaTypeMap: Record<string, string> = {
  PAGE: "WebPage",
  BLOG: "Article",
  Project: "Product",
  SETTING: "Organization",
};

const SeoForm = ({ id, seoType }: SeoFormProps) => {
  const {
    loading,
    saving,
    onSubmit,
    form,
    imagePreview,
    handleImageChange,
    removeImage,
  } = useSeo({
    id,
    seoType,
  });

  const handleGenerateSchema = () => {
    const title = form.getValues("og_ttile");
    const description = form.getValues("og_description");

    const schemaType = schemaTypeMap[String(seoType)] ?? "WebPage";

    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: title || "",
      description: description
        ? description.replace(/<[^>]*>/g, "").trim()
        : "",
    };

    if (imagePreview && !imagePreview.startsWith("data:")) {
      schema.image = imagePreview;
    }

    form.setValue("schema_markup", JSON.stringify(schema, null, 2), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  if (loading) {
    return <SeoFormSkeleton />;
  }

  return (
    <div className="mx-auto w-full py-5">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* SEO Title */}
            <Controller
              name="og_ttile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="og_ttile">
                      SEO Title
                      <span className="text-red-400">*</span>
                    </FieldLabel>

                    <span
                      className={`text-xs ${
                        (field.value?.length ?? 0) > 70
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {field.value?.length ?? 0}/70
                    </span>
                  </div>

                  <Input
                    {...field}
                    id="og_ttile"
                    value={field.value ?? ""}
                    placeholder="Enter SEO title"
                    maxLength={70}
                    disabled={loading || saving}
                  />

                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            {/* SEO Keywords */}
            <Controller
              name="keywords"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="keywords">SEO Keywords</FieldLabel>

                  <Input
                    {...field}
                    id="keywords"
                    value={field.value ?? ""}
                    placeholder="developer, web developer, software engineer, frontend developer, bcg developer, react developer, nextjs developer, typescript developer"
                    disabled={loading || saving}
                  />

                  <p className="text-xs text-muted-foreground">
                    Separate keywords using commas.
                  </p>

                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </div>

          {/* SEO Description */}
          <Controller
            name="og_description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="og_description">
                    SEO Description
                    <span className="text-red-400">*</span>
                  </FieldLabel>

                  <span
                    className={`text-xs ${
                      (field.value?.length ?? 0) > 160
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {field.value?.length ?? 0}/160
                  </span>
                </div>

                <BaseTextEditor {...field} />

                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* Schema Markup */}
          <Controller
            name="schema_markup"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <FieldLabel htmlFor="schema_markup">
                      Schema Markup
                    </FieldLabel>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Add valid Schema.org JSON-LD structured data.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSchema}
                    disabled={loading || saving}
                  >
                    Generate Template
                  </Button>
                </div>

                <Textarea
                  {...field}
                  id="schema_markup"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  rows={16}
                  spellCheck={false}
                  disabled={loading || saving}
                  className="font-mono text-xs leading-5"
                  placeholder={`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page title",
  "description": "Page description"
}`}
                />

                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* SEO Image */}
          <Controller
            name="og_image"
            control={form.control}
            render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="og_image">Social Sharing Image</FieldLabel>

                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200 × 630 pixels.
                </p>

                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative aspect-[1200/630] w-full max-w-[600px] overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview}
                        alt="SEO image preview"
                        fill
                        sizes="(max-width: 600px) 100vw, 600px"
                        unoptimized
                        className="object-cover"
                      />

                      <button
                        type="button"
                        aria-label="Remove SEO image"
                        onClick={() => removeImage(onChange)}
                        disabled={loading || saving}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="og_image"
                      className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-col items-center justify-center px-4 py-5 text-center">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />

                        <p className="text-sm text-muted-foreground">
                          Click to upload image
                        </p>
                      </div>

                      <input
                        id="og_image"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        name={name}
                        onBlur={onBlur}
                        ref={ref}
                        disabled={loading || saving}
                        onChange={(event) => handleImageChange(event, onChange)}
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

          <Button
            type="submit"
            variant="default"
            disabled={loading || saving || form.formState.isSubmitting}
            className="w-fit cursor-pointer"
          >
            {saving || form.formState.isSubmitting ? (
              <>
                Saving
                <Loader />
              </>
            ) : (
              <>
                Save
                <File className="h-4 w-4" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default SeoForm;
