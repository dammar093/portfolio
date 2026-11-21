
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

import Link from "next/link";

import { useFAQs } from "../_hooks/useFaqList";

import type {
  FAQItem,
  FAQPaginationMeta,
} from "../_types/faq";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// ==============================
// FAQ DATA TABLE
// ==============================
interface FAQDataTableProps {
  faqs: FAQItem[];
  meta: FAQPaginationMeta;
  onDelete: (faq: FAQItem) => void;
}

const FAQDataTable = memo(function FAQDataTable({
  faqs,
  meta,
  onDelete,
}: FAQDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {faqs.map((faq, index) => (
          <TableRow key={faq.id}>
            {/* Serial Number */}
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            {/* Question */}
            <TableCell className="max-w-xs font-medium">
              <p className="truncate">{faq.question}</p>
            </TableCell>

            {/* Answer */}
            <TableCell>
              <p className="max-w-md truncate text-sm text-muted-foreground">
                {faq.answer}
              </p>
            </TableCell>

            {/* Order */}
            <TableCell>{faq.order}</TableCell>

            {/* Status */}
            <TableCell>
              {faq.isActive ? (
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
                      <Link href={`/admin/faqs/${faq.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Edit FAQ
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
                      onClick={() => onDelete(faq)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Delete FAQ
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
// FAQ TABLE RESULTS
// ==============================
interface FAQTableResultsProps {
  faqs: FAQItem[];
  meta: FAQPaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (faq: FAQItem) => void;
}

const FAQTableResults = memo(function FAQTableResults({
  faqs,
  meta,
  loading,
  error,
  onDelete,
}: FAQTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (faqs.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No FAQs found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <FAQDataTable
        faqs={faqs}
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
// MAIN FAQs TABLE
// ==============================
export function FAQsTable() {
  const {
    faqs,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteFAQ,
  } = useFAQs();

  const [selectedFAQ, setSelectedFAQ] =
    useState<FAQItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ==============================
  // CONFIRM DELETE
  // ==============================
  const confirmDelete = useCallback(async () => {
    if (!selectedFAQ || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteFAQ(selectedFAQ.id);

      setSelectedFAQ(null);
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedFAQ, isDeleting, handleDeleteFAQ]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create FAQ"
          link="/faqs/create-faq"
          hideCreate={listLoading || Boolean(listError)}
        />

        <FAQTableResults
          faqs={faqs}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedFAQ}
        />
      </div>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={Boolean(selectedFAQ)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedFAQ(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete FAQ?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedFAQ?.question}
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
