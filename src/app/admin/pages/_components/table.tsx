"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import Paginations from "@/components/admin/shared/Paginations";
import { SearchCreate } from "@/components/admin/shared/Search-carate";
import { Edit, FileSearch, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { usePages } from "../_hooks/usePageList";
import type { PageItem, PaginationMeta } from "../_types/page";
import { Error } from "./error";
import { TableSkeleton } from "./loading";

interface PageDataTableProps {
  pages: PageItem[];
  meta: PaginationMeta;
  onDelete: (id: string) => void;
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
          <TableHead>Order</TableHead>
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
                <div className="relative h-16 w-20 overflow-hidden rounded">
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
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {page.order}
              </span>
            </TableCell>
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

                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Delete Page</TooltipContent>
                  </Tooltip>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete page &quot;{page.title}&quot;?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The page and its
                        associated data will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => onDelete(page.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
  onDelete: (id: string) => void;
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
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDelete,
  } = usePages();

  return (
    <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
      <SearchCreate
        search={searchInput}
        onSearch={setSearch}
        title="Create Page"
        link="/pages/create-page"
      />
      <PageTableResults
        pages={pages}
        meta={meta}
        loading={listLoading}
        error={listError}
        onDelete={handleDelete}
      />
    </div>
  );
}
