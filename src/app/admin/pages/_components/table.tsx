"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import Paginations from "@/components/admin/shared/Paginations";
import { SearchCreate } from "@/components/admin/shared/Search-carate";
import { Edit, FileSearch, LoaderCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { usePages } from "../_hooks/usePageList";
import { pages as availablePageSlugs } from "../_schema/page-schema";
import type { PageItem, PaginationMeta } from "../_types/page";
import { Error } from "./error";
import { TableSkeleton } from "./loading";

interface PageDataTableProps {
  pages: PageItem[];
  meta: PaginationMeta;
  onDelete: (page: PageItem) => void;
}

const PageDataTable = memo(function PageDataTable({
  pages,
  meta,
  onDelete,
}: PageDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page, index) => (
          <TableRow key={page.id}>
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>
            <TableCell>
              {page.image ? (
                <div className="relative aspect-[3/2] w-24 overflow-hidden rounded">
                  <Image
                    src={page.image}
                    alt={page.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </TableCell>
            <TableCell className="font-medium capitalize">
              {page.title}
            </TableCell>
            <TableCell>{page.slug}</TableCell>
            <TableCell className="w-32">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-blue-500"
                    >
                      <Link href={`/admin/pages/${page.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Page</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-green-500"
                    >
                      <Link href={`/admin/pages/${page.id}/seo`}>
                        <FileSearch className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Page SEO</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      aria-label={`Delete ${page.title}`}
                      onClick={() => onDelete(page)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Page</TooltipContent>
                </Tooltip>

              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

interface PageTableResultsProps {
  pages: PageItem[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (page: PageItem) => void;
}

const PageTableResults = memo(function PageTableResults({
  pages,
  meta,
  loading,
  error,
  onDelete,
}: PageTableResultsProps) {
  if (error) return <Error error={error} />;
  if (loading) return <TableSkeleton />;
  if (pages.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No pages found
      </div>
    );
  }
  if (!meta) return null;

  return (
    <>
      <PageDataTable pages={pages} meta={meta} onDelete={onDelete} />
      <Paginations
        page={meta.page}
        limit={meta.limit}
        totalPages={meta.totalPages}
        total={meta.total}
      />
    </>
  );
});

export function PagesTable() {
  const {
    pages,
    usedSlugs,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeletePage,
  } = usePages();
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedPage || isDeleting) return;
    setIsDeleting(true);
    try {
      await handleDeletePage(selectedPage.id);
      setSelectedPage(null);
    } catch (error) {
      console.error("Failed to delete page:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
      <SearchCreate
        search={searchInput}
        onSearch={setSearch}
        title="Create Page"
        link="/pages/create-page"
        hideCreate={
          listLoading ||
          Boolean(listError) ||
          availablePageSlugs.every((slug) => usedSlugs.includes(slug))
        }
      />
      <PageTableResults
        pages={pages}
        meta={meta}
        loading={listLoading}
        error={listError}
        onDelete={setSelectedPage}
      />

      <AlertDialog
        open={Boolean(selectedPage)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setSelectedPage(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete page?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-semibold text-foreground">{selectedPage?.title}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {isDeleting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {isDeleting ? "Deleting…" : "Delete page"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
