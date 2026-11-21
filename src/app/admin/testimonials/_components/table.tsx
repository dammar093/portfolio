
"use client";

import { useState, memo, useCallback } from "react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Paginations from "@/components/admin/shared/Paginations";
import { SearchCreate } from "@/components/admin/shared/Search-carate";

import {
  Edit,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { useTestimonials } from "../_hooks/useTestimonialsList";

import type {
  TestimonialItem,
  TestimonialPaginationMeta,
} from "../_types/testimonial";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// ==============================
// TESTIMONIAL DATA TABLE
// ==============================
interface TestimonialDataTableProps {
  testimonials: TestimonialItem[];
  meta: TestimonialPaginationMeta;
  onDelete: (testimonial: TestimonialItem) => void;
}

const TestimonialDataTable = memo(function TestimonialDataTable({
  testimonials,
  meta,
  onDelete,
}: TestimonialDataTableProps) {
  return (
    <Table className="w-full border">
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
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {testimonials.map((testimonial, index) => (
          <TableRow key={testimonial.id}>
            {/* Serial Number */}
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            {/* Avatar */}
            <TableCell>
              {testimonial.avatar ? (
                <div className="relative aspect-square w-12 overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No avatar
                </span>
              )}
            </TableCell>

            {/* Name */}
            <TableCell className="font-medium capitalize">
              {testimonial.name}
            </TableCell>

            {/* Position */}
            <TableCell>
              {testimonial.position}
            </TableCell>

            {/* Company */}
            <TableCell className="capitalize">
              {testimonial.company}
            </TableCell>

            {/* Testimonial */}
            <TableCell>
              <p className="max-w-xs truncate text-sm text-muted-foreground">
                {testimonial.testimonial}
              </p>
            </TableCell>

            {/* Order */}
            <TableCell>{testimonial.order}</TableCell>

            {/* Status */}
            <TableCell>
              {testimonial.isActive ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  Inactive
                </span>
              )}
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center gap-1">
                {/* Edit */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-blue-500"
                    >
                      <Link href={`/admin/testimonials/${testimonial.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Edit Testimonial
                  </TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(testimonial)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Delete Testimonial
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

// ==============================
// TESTIMONIAL TABLE RESULTS
// ==============================
interface TestimonialTableResultsProps {
  testimonials: TestimonialItem[];
  meta: TestimonialPaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (testimonial: TestimonialItem) => void;
}

const TestimonialTableResults = memo(function TestimonialTableResults({
  testimonials,
  meta,
  loading,
  error,
  onDelete,
}: TestimonialTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (testimonials.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No testimonials found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <TestimonialDataTable
        testimonials={testimonials}
        meta={meta}
        onDelete={onDelete}
      />

      <Paginations
        page={meta.page}
        limit={meta.limit}
        totalPages={meta.totalPages}
        total={meta.total}
      />
    </>
  );
});

// ==============================
// MAIN TESTIMONIALS TABLE
// ==============================
export function TestimonialsTable() {
  const {
    testimonials,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteTestimonial,
  } = useTestimonials();

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<TestimonialItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ==============================
  // CONFIRM DELETE
  // ==============================
  const confirmDelete = useCallback(async () => {
    if (!selectedTestimonial || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteTestimonial(selectedTestimonial.id);

      setSelectedTestimonial(null);
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [
    selectedTestimonial,
    isDeleting,
    handleDeleteTestimonial,
  ]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create Testimonial"
          link="/testimonials/create-testimonial"
          hideCreate={listLoading || Boolean(listError)}
        />

        <TestimonialTableResults
          testimonials={testimonials}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedTestimonial}
        />
      </div>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={Boolean(selectedTestimonial)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedTestimonial(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Testimonial?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedTestimonial?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
