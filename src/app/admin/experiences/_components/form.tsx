
"use client";

import Image from "next/image";
import { Controller } from "react-hook-form";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { BaseTextEditor } from "@/components/admin/shared/text-editor";

import { useExperienceForm } from "../_hooks/useExperienceForm";
import { ExperienceFormSkeleton } from "./form-skeleton";

const employmentTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "SELF_EMPLOYED", label: "Self Employed" },
];

/**
 * Safely converts an unknown value into YYYY-MM-DD.
 * Supports Date, ISO date strings, null and undefined.
 */
const toDateInputValue = (value: unknown): string => {
  if (!value) return "";

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string") {
    date = new Date(value);
  } else {
    return "";
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

/**
 * Converts HTML date input values to UTC midnight.
 */
const fromDateInputValue = (value: string): Date | null => {
  if (!value) return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
};

export default function ExperienceForm() {
  const {
    form,
    isEdit,
    loading,
    isLoadingPage,
    preview,
    handleImageChange,
    removeImage,
    onSubmit,
  } = useExperienceForm();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const isCurrent = watch("isCurrent");

  if (isLoadingPage) {
    return <ExperienceFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full space-y-6 py-5">
      {/* Company and Position */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">
            Company Name <span className="text-red-500">*</span>
          </Label>

          <Input
            id="company"
            placeholder="Enter company name"
            {...register("company")}
          />

          {errors.company && (
            <p className="text-sm text-red-500">
              {errors.company.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            Job Position <span className="text-red-500">*</span>
          </Label>

          <Input
            id="position"
            placeholder="Enter your job position"
            {...register("position")}
          />

          {errors.position && (
            <p className="text-sm text-red-500">
              {errors.position.message}
            </p>
          )}
        </div>
      </div>

      {/* Employment Type and Location */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employmentType">
            Employment Type <span className="text-red-500">*</span>
          </Label>

          <select
            id="employmentType"
            {...register("employmentType")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {employmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {errors.employmentType && (
            <p className="text-sm text-red-500">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>

          <Input
            id="location"
            placeholder="e.g. Kathmandu, Nepal / Remote"
            {...register("location")}
          />

          {errors.location && (
            <p className="text-sm text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      {/* Joining Date and Leaving Date */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="joinDate">
            Joining Date <span className="text-red-500">*</span>
          </Label>

          <Controller
            name="joinDate"
            control={control}
            render={({ field }) => (
              <Input
                id="joinDate"
                type="date"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={toDateInputValue(field.value)}
                onChange={(event) => {
                  const date = fromDateInputValue(
                    event.target.value
                  );

                  field.onChange(date ?? undefined);
                }}
              />
            )}
          />

          {errors.joinDate && (
            <p className="text-sm text-red-500">
              {errors.joinDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="leaveDate">Leaving Date</Label>

          <Controller
            name="leaveDate"
            control={control}
            render={({ field }) => (
              <Input
                id="leaveDate"
                type="date"
                disabled={isCurrent}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={toDateInputValue(field.value)}
                onChange={(event) => {
                  const date = fromDateInputValue(
                    event.target.value
                  );

                  field.onChange(date);
                }}
              />
            )}
          />

          {errors.leaveDate && (
            <p className="text-sm text-red-500">
              {errors.leaveDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Current Employment */}
      <div className="flex items-center gap-3">
        <Controller
          name="isCurrent"
          control={control}
          render={({ field }) => (
            <input
              id="isCurrent"
              type="checkbox"
              checked={Boolean(field.value)}
              onBlur={field.onBlur}
              onChange={(event) => {
                const checked = event.target.checked;

                field.onChange(checked);

                if (checked) {
                  setValue("leaveDate", null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              className="h-4 w-4 rounded border-gray-300"
            />
          )}
        />

        <Label htmlFor="isCurrent" className="cursor-pointer">
          I currently work here
        </Label>
      </div>

      {errors.isCurrent && (
        <p className="text-sm text-red-500">
          {errors.isCurrent.message}
        </p>
      )}

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">
              Description <span className="text-red-400">*</span>
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

      {/* Display Order and Status */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                value={
                  field.value == null ? "" : String(field.value)
                }
                onChange={(event) => {
                  const value = event.target.value;

                  field.onChange(
                    value === "" ? undefined : Number(value)
                  );
                }}
              />
            )}
          />

          {errors.order && (
            <p className="text-sm text-red-500">
              {errors.order.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <input
                id="isActive"
                type="checkbox"
                checked={Boolean(field.value)}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            )}
          />

          <Label htmlFor="isActive" className="cursor-pointer">
            Active Experience
          </Label>
        </div>
      </div>

      {/* Company Image */}
      <div className="space-y-3">
        <Label htmlFor="experience-image">
          Company Image
        </Label>

        {preview ? (
          <div className="relative h-40 w-48 overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Company image preview"
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
              aria-label="Remove company image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="experience-image"
            className="flex h-40 w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed hover:bg-muted"
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Upload company image
            </span>

            <span className="text-xs text-muted-foreground">
              PNG, JPG, WEBP (Max 5 MB)
            </span>
          </label>
        )}

        <Input
          id="experience-image"
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
            ? "Update Experience"
            : "Create Experience"}
      </Button>
    </form>
  );
}
