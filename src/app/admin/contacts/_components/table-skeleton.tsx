
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
    <Table className="w-full border" aria-label="Loading contacts">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Inquiry</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }, (_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-36" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-5 w-16 rounded-full" />
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
