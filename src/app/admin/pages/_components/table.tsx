"use client";

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
import { Edit, FileSearch } from "lucide-react";
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
}

const PageDataTable = memo(function PageDataTable({
  pages,
  meta,
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
}

const PageTableResults = memo(function PageTableResults({
  pages,
  meta,
  loading,
  error,
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
      <PageDataTable pages={pages} meta={meta} />
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
  } = usePages();

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
      />
    </div>
  );
}
