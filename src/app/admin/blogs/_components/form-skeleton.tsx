import { Skeleton } from "@/components/ui/skeleton";

export const BlogFormSkeleton = () => {
  return (
    <div
      className="mx-auto w-full space-y-7 py-5"
      role="status"
      aria-label="Loading blog form"
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-32 w-40 rounded-lg" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>

      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
};