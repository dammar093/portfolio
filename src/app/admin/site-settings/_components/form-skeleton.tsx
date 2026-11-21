
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonField = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-11 w-full rounded-lg" />
  </div>
);

const SkeletonCard = ({
  fields = 4,
}: {
  fields?: number;
}) => (
  <div className="rounded-xl border bg-card">
    <div className="space-y-2 border-b p-6">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-4 w-64 max-w-full" />
    </div>

    <div className="grid gap-5 p-6 sm:grid-cols-2">
      {Array.from({ length: fields }).map((_, index) => (
        <SkeletonField key={index} />
      ))}
    </div>
  </div>
);

export function SettingFormSkeleton() {
  return (
    <div
      className="mx-auto w-full space-y-6"
      role="status"
      aria-label="Loading settings form"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      {/* GENERAL INFORMATION */}
      <div className="rounded-xl border bg-card">
        <div className="space-y-2 border-b p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-28 w-28 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonField key={index} />
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <SkeletonCard fields={5} />

      {/* TRACKING */}
      <div className="rounded-xl border bg-card">
        <div className="space-y-2 border-b p-6">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        <div className="space-y-2 p-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
