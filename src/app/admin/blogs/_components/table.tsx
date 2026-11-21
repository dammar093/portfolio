
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
  FileSearch,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { useBlogs } from "../_hooks/useBlogList";

import type {
  BlogItem,
  BlogPaginationMeta,
} from "../_types/blog";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeketon";

// ==============================
// BLOG DATA TABLE
// ==============================

interface BlogDataTableProps {
  blogs: BlogItem[];
  meta: BlogPaginationMeta;
  onDelete: (blog: BlogItem) => void;
}

const BlogDataTable = memo(function BlogDataTable({
  blogs,
  meta,
  onDelete,
}: BlogDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {blogs.map((blog, index) => (
          <TableRow key={blog.id}>
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            <TableCell>
              {blog.image ? (
                <div className="relative aspect-[3/2] w-24 overflow-hidden rounded">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No image
                </span>
              )}
            </TableCell>

            <TableCell className="font-medium capitalize">
              {blog.title}
            </TableCell>

            <TableCell>{blog.slug}</TableCell>

            <TableCell>
              {blog.isActive ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  Inactive
                </span>
              )}
            </TableCell>

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
                      <Link href={`/admin/blogs/${blog.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Edit Blog</TooltipContent>
                </Tooltip>

                {/* SEO */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-green-500"
                    >
                      <Link href={`/admin/blogs/${blog.id}/seo`}>
                        <FileSearch className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Blog SEO</TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(blog)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Delete Blog</TooltipContent>
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
// BLOG TABLE RESULTS
// ==============================

interface BlogTableResultsProps {
  blogs: BlogItem[];
  meta: BlogPaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (blog: BlogItem) => void;
}

const BlogTableResults = memo(function BlogTableResults({
  blogs,
  meta,
  loading,
  error,
  onDelete,
}: BlogTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (blogs.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No blogs found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <BlogDataTable
        blogs={blogs}
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
// MAIN BLOGS TABLE
// ==============================

export function BlogsTable() {
  const {
    blogs,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteBlog,
  } = useBlogs();

  const [selectedBlog, setSelectedBlog] =
    useState<BlogItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ==============================
  // CONFIRM DELETE
  // ==============================

  const confirmDelete = useCallback(async () => {
    if (!selectedBlog || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteBlog(selectedBlog.id);

      setSelectedBlog(null);
    } catch (error) {
      console.error("Failed to delete blog:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedBlog, isDeleting, handleDeleteBlog]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create Blog"
          link="/blogs/create-blog"
          hideCreate={listLoading || Boolean(listError)}
        />

        <BlogTableResults
          blogs={blogs}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedBlog}
        />
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={Boolean(selectedBlog)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedBlog(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Blog?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedBlog?.title}
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
