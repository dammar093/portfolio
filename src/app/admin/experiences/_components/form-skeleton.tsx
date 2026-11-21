import { Skeleton } from "@/components/ui/skeleton";

export function ExperienceFormSkeleton() {
  return (
    <div
      className="mx-auto w-full space-y-6 py-5"
      role="status"
      aria-label="Loading experience form"
    >
      {/* Company and Position */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Employment Type and Location */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Joining Date and Leaving Date */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Current Employment Checkbox */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>

      {/* Display Order and Active Status */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Company Image Upload */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-40 w-48 rounded-lg" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-40 rounded-md" />

      <span className="sr-only">
        Loading experience form...
      </span>
    </div>
  );
}