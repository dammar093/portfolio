import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
  return (
    <Table className="w-full border" aria-label="Loading experiences">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Employment Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }, (_, i) => (
          <TableRow key={i}>
            {/* Serial Number */}
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            {/* Image */}
            <TableCell>
              <Skeleton className="h-12 w-12 rounded" />
            </TableCell>

            {/* Company */}
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </TableCell>

            {/* Position */}
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>

            {/* Employment Type */}
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>

            {/* Duration */}
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </TableCell>

            {/* Order */}
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            {/* Status */}
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}