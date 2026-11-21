
import { Skeleton } from "@/components/ui/skeleton";

export const LanguageFormSkeleton = ({
  isEdit,
}: {
  isEdit: boolean;
}) => {
  return (
    <div
      className="mx-auto w-full space-y-7 py-5"
      role="status"
      aria-label="Loading language form"
    >
      {/* Name and Order */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>

      {/* Language Image */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-32 w-40 rounded-lg" />
        <Skeleton className="h-3 w-56" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-36 rounded-md" />
    </div>
  );
};
