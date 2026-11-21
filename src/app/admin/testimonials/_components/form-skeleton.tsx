
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialFormSkeleton() {
  return (
    <div
      className="mx-auto w-full space-y-6 py-5"
      role="status"
      aria-label="Loading testimonial form"
    >
      {/* Name and Position */}
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

      {/* Company and Order */}
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

      {/* Testimonial */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>

      {/* Active Testimonial */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Avatar Upload */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-40 rounded-lg" />
        <Skeleton className="h-3 w-56" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-40 rounded-md" />

      <span className="sr-only">
        Loading testimonial form...
      </span>
    </div>
  );
}
