
"use client";

import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useFAQForm } from "../_hooks/useFaqForm";
import { FAQFormSkeleton } from "./form-skeleton";

export default function FAQForm() {
  const {
    form,
    isEdit,
    loading,
    isLoadingPage,
    isSubmitting,
    onSubmit,
  } = useFAQForm();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  if (isLoadingPage) {
    return <FAQFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full space-y-6 py-5">
      {/* Question and Order */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="question">
            Question <span className="text-red-500">*</span>
          </Label>

          <Input
            id="question"
            placeholder="Enter FAQ question"
            {...register("question")}
          />

          {errors.question && (
            <p className="text-sm text-red-500">
              {errors.question.message}
            </p>
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
      </div>

      {/* Answer */}
      <div className="space-y-2">
        <Label htmlFor="answer">
          Answer <span className="text-red-500">*</span>
        </Label>

        <Textarea
          id="answer"
          placeholder="Enter FAQ answer..."
          rows={8}
          {...register("answer")}
        />

        {errors.answer && (
          <p className="text-sm text-red-500">
            {errors.answer.message}
          </p>
        )}
      </div>

      {/* Active FAQ */}
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
          Active FAQ
        </Label>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading || isSubmitting}>
        {loading || isSubmitting
          ? "Please wait..."
          : isEdit
            ? "Update FAQ"
            : "Create FAQ"}
      </Button>
    </form>
  );
}
