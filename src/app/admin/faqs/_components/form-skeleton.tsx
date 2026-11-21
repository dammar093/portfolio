
import { Skeleton } from "@/components/ui/skeleton";

export function FAQFormSkeleton() {
  return (
    <div
      className="mx-auto w-full space-y-6 py-5"
      role="status"
      aria-label="Loading FAQ form"
    >
      {/* Question and Order */}
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

      {/* Answer */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>

      {/* Active FAQ */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-40 rounded-md" />

      <span className="sr-only">
        Loading FAQ form...
      </span>
    </div>
  );
}
