"use client";

import { File, Upload, X } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";

import { SeoType } from "@/generated/prisma/enums";
import { useSeo } from "@/hooks/use-seo/useSeo";

import { Loader } from "@/components/shared/loader";
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
  PRODUCT: "Product",
  BLOG: "BlogPosting",
  SERVICE: "Service",
  SETTING: "Organization",
  REBATE: "Offer",
  CASE_STUDY: "Article",
};

const SeoForm = ({ id, seoType }: SeoFormProps) => {
  const {
    loading,
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
    const title = form.getValues("title");
    const description = form.getValues("description");

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

    form.setValue("schemaMarkup", JSON.stringify(schema, null, 2), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  if (loading) {
    return <SeoFormSkeleton />;
  }

  return (
    <div className="mx-auto w-full py-5">
      {/*@ts-ignore */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* SEO Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="title">
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
                    id="title"
                    value={field.value ?? ""}
                    placeholder="Enter SEO title"
                    maxLength={70}
                    disabled={loading}
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
                    placeholder="solar panel, renewable energy, solar system"
                    disabled={loading}
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
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="description">
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
            name="schemaMarkup"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <FieldLabel htmlFor="schemaMarkup">
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
                    disabled={loading}
                  >
                    Generate Template
                  </Button>
                </div>

                <Textarea
                  {...field}
                  id="schemaMarkup"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  rows={16}
                  spellCheck={false}
                  disabled={loading}
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
            name="image"
            control={form.control}
            render={({
              field: { onChange, value: _value, ...field },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="image">Social Sharing Image</FieldLabel>

                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200 × 630 pixels.
                </p>

                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative inline-block overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview}
                        alt="SEO image preview"
                        width={600}
                        height={315}
                        unoptimized
                        className="h-auto max-h-[315px] w-full max-w-[600px] object-cover"
                      />

                      <button
                        type="button"
                        aria-label="Remove SEO image"
                        onClick={() => removeImage(onChange)}
                        disabled={loading}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image"
                      className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-col items-center justify-center px-4 py-5 text-center">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />

                        <p className="text-sm text-muted-foreground">
                          Click to upload image
                        </p>
                      </div>

                      <input
                        {...field}
                        id="image"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        disabled={loading}
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
            variant="gardient"
            disabled={loading || form.formState.isSubmitting}
            className="w-fit cursor-pointer"
          >
            {loading || form.formState.isSubmitting ? (
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
