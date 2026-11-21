
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

import { Edit, Trash2, LoaderCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { useExperiences } from "../_hooks/useExperienceList";

import type {
  ExperienceItem,
  ExperiencePaginationMeta,
} from "../_types/experience";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// ==============================
// EMPLOYMENT TYPE LABELS
// ==============================

const employmentTypeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  SELF_EMPLOYED: "Self Employed",
};

// ==============================
// FORMAT DATE
// ==============================

const formatDate = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "—";

  const parsedDate =
    date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(parsedDate);
};

// ==============================
// EXPERIENCE DATA TABLE
// ==============================

interface ExperienceDataTableProps {
  experiences: ExperienceItem[];
  meta: ExperiencePaginationMeta;
  onDelete: (experience: ExperienceItem) => void;
}

const ExperienceDataTable = memo(function ExperienceDataTable({
  experiences,
  meta,
  onDelete,
}: ExperienceDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Employment Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {experiences.map((experience, index) => (
          <TableRow key={experience.id}>
            {/* Serial Number */}
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            {/* Company Image */}
            <TableCell>
              {experience.image ? (
                <div className="relative aspect-square w-12 overflow-hidden rounded">
                  <Image
                    src={experience.image}
                    alt={experience.company}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No image
                </span>
              )}
            </TableCell>

            {/* Company */}
            <TableCell className="font-medium capitalize">
              <div className="flex flex-col gap-1">
                <span>{experience.company}</span>

                {experience.location && (
                  <span className="text-xs text-muted-foreground">
                    {experience.location}
                  </span>
                )}
              </div>
            </TableCell>

            {/* Position */}
            <TableCell className="font-medium">
              {experience.position}
            </TableCell>

            {/* Employment Type */}
            <TableCell>
              <span className="text-sm">
                {employmentTypeLabels[experience.employmentType] ??
                  experience.employmentType}
              </span>
            </TableCell>

            {/* Duration */}
            <TableCell>
              <div className="flex flex-col gap-1 text-sm">
                <span>
                  {formatDate(experience.joinDate)} -{" "}
                  {experience.isCurrent
                    ? "Present"
                    : formatDate(experience.leaveDate)}
                </span>

                {experience.isCurrent && (
                  <span className="text-xs text-green-600">
                    Currently Working
                  </span>
                )}
              </div>
            </TableCell>

            {/* Order */}
            <TableCell>{experience.order}</TableCell>

            {/* Status */}
            <TableCell>
              {experience.isActive ? (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
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
                      <Link
                        href={`/admin/experiences/${experience.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Edit Experience
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
                      onClick={() => onDelete(experience)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Delete Experience
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
// EXPERIENCE TABLE RESULTS
// ==============================

interface ExperienceTableResultsProps {
  experiences: ExperienceItem[];
  meta: ExperiencePaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (experience: ExperienceItem) => void;
}

const ExperienceTableResults = memo(
  function ExperienceTableResults({
    experiences,
    meta,
    loading,
    error,
    onDelete,
  }: ExperienceTableResultsProps) {
    if (error) return <Error error={error} />;

    if (loading) return <TableSkeleton />;

    if (experiences.length === 0) {
      return (
        <div className="rounded-md border py-8 text-center text-muted-foreground">
          No experiences found
        </div>
      );
    }

    if (!meta) return null;

    return (
      <>
        <ExperienceDataTable
          experiences={experiences}
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
  }
);

// ==============================
// MAIN EXPERIENCE TABLE
// ==============================

export function ExperiencesTable() {
  const {
    experiences,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteExperience,
  } = useExperiences();

  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ==============================
  // CONFIRM DELETE
  // ==============================

  const confirmDelete = useCallback(async () => {
    if (!selectedExperience || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteExperience(selectedExperience.id);

      setSelectedExperience(null);
    } catch (error) {
      console.error("Failed to delete experience:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [
    selectedExperience,
    isDeleting,
    handleDeleteExperience,
  ]);

  // ==============================
  // RENDER
  // ==============================

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create Experience"
          link="/experiences/create-experience"
          hideCreate={listLoading || Boolean(listError)}
        />

        <ExperienceTableResults
          experiences={experiences}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedExperience}
        />
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(selectedExperience)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedExperience(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Experience?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedExperience?.position} at{" "}
                {selectedExperience?.company}
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
