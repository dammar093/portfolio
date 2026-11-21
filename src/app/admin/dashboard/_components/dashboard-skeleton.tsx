import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-background p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* Value */}
      <Skeleton className="mb-3 h-9 w-24" />

      {/* Description */}
      <Skeleton className="h-4 w-36" />
    </div>
  );
}

function SkeletonSection({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-6 rounded-2xl border bg-background p-6 shadow-sm">
      <Skeleton className="h-6 w-40" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading dashboard">
      {/* Main statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      {/* Content statistics */}
      <SkeletonSection items={4} />

      {/* Other statistics */}
      <SkeletonSection items={4} />

      <span className="sr-only">Loading dashboard statistics...</span>
    </div>
  );
}
