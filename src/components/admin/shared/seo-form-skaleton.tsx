import { Skeleton } from "@/components/ui/skeleton";

export const SeoFormSkeleton = () => {
  return (
    <div className="w-full mx-auto py-5">
      <div className="space-y-6">
        {/* Title + Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-40 rounded-lg border border-dashed" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  );
};
