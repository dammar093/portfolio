
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
    <Table className="w-full border" aria-label="Loading testimonials">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Avatar</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Testimonial</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }, (_, index) => (
          <TableRow key={index}>
            {/* Serial Number */}
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            {/* Avatar */}
            <TableCell>
              <Skeleton className="h-12 w-12" />
            </TableCell>

            {/* Name */}
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>

            {/* Position */}
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>

            {/* Company */}
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>

            {/* Testimonial */}
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>

            {/* Order */}
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            {/* Status */}
            <TableCell>
              <Skeleton className="h-5 w-16 rounded-full" />
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
