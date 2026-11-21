
import { Skeleton } from "@/components/ui/skeleton";

export function ServiceFormSkeleton() {
  return (
    <div
      className="mx-auto w-full space-y-6 py-5"
      role="status"
      aria-label="Loading service form"
    >
      {/* Title and Order */}
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

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-40 w-48 rounded-lg" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-36 rounded-md" />

      <span className="sr-only">
        Loading service form...
      </span>
    </div>
  );
}
