
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

import { useLanguages } from "../_hooks/useLanguageList";

import type {
  LanguageItem,
  LanguagePaginationMeta,
} from "../_types/language";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// Language Data Table
interface LanguageDataTableProps {
  languages: LanguageItem[];
  meta: LanguagePaginationMeta;
  onDelete: (language: LanguageItem) => void;
}

const LanguageDataTable = memo(function LanguageDataTable({
  languages,
  meta,
  onDelete,
}: LanguageDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {languages.map((language, index) => (
          <TableRow key={language.id}>
            <TableCell>{(meta.page - 1) * meta.limit + index + 1}</TableCell>

            <TableCell>
              {language.image ? (
                <div className="relative aspect-square w-12 overflow-hidden rounded">
                  <Image
                    src={language.image}
                    alt={language.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </TableCell>

            <TableCell className="font-medium capitalize">
              {language.name}
            </TableCell>

            <TableCell>{language.order}</TableCell>

            <TableCell>{language._count?.projects ?? 0}</TableCell>

            <TableCell>
              {language.isActive ? (
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
                      <Link href={`/admin/languages/${language.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Edit Language</TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(language)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Delete Language</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

// Language Table Results
interface LanguageTableResultsProps {
  languages: LanguageItem[];
  meta: LanguagePaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (language: LanguageItem) => void;
}

const LanguageTableResults = memo(function LanguageTableResults({
  languages,
  meta,
  loading,
  error,
  onDelete,
}: LanguageTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (languages.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No languages found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <LanguageDataTable
        languages={languages}
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

// Main Languages Table
export function LanguagesTable() {
  const {
    languages,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteLanguage,
  } = useLanguages();

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = useCallback(async () => {
    if (!selectedLanguage || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteLanguage(selectedLanguage.id);

      setSelectedLanguage(null);
    } catch (error) {
      console.error("Failed to delete language:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedLanguage, isDeleting, handleDeleteLanguage]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create Language"
          link="/languages/create-language"
          hideCreate={listLoading || Boolean(listError)}
        />

        <LanguageTableResults
          languages={languages}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedLanguage}
        />
      </div>

      <AlertDialog
        open={Boolean(selectedLanguage)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedLanguage(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Language?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedLanguage?.name}
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
