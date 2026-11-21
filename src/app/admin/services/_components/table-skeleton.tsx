
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
    <Table className="w-full border" aria-label="Loading services">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }, (_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-12 w-12 rounded" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>

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
