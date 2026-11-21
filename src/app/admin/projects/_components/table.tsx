
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

import { useProjects } from "../_hooks/useProjectList";

import type {
  ProjectItem,
  ProjectPaginationMeta,
} from "../_types/project";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// ==============================
// PROJECT DATA TABLE
// ==============================

interface ProjectDataTableProps {
  projects: ProjectItem[];
  meta: ProjectPaginationMeta;
  onDelete: (project: ProjectItem) => void;
}

const ProjectDataTable = memo(function ProjectDataTable({
  projects,
  meta,
  onDelete,
}: ProjectDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {projects.map((project, index) => (
          <TableRow key={project.id}>
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            <TableCell>
              {project.image ? (
                <div className="relative aspect-[3/2] w-24 overflow-hidden rounded">
                  <Image
                    src={project.image}
                    alt={project.title}
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
              {project.title}
            </TableCell>

            <TableCell>{project.slug}</TableCell>

            <TableCell>{project.order}</TableCell>

            <TableCell>
              {project.isActive ? (
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
                {/* EDIT */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-blue-500"
                    >
                      <Link href={`/admin/projects/${project.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Edit Project</TooltipContent>
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
                      <Link href={`/admin/projects/${project.id}/seo`}>
                        <FileSearch className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Project SEO</TooltipContent>
                </Tooltip>

                {/* DELETE */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Delete Project</TooltipContent>
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
// PROJECT TABLE RESULTS
// ==============================

interface ProjectTableResultsProps {
  projects: ProjectItem[];
  meta: ProjectPaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (project: ProjectItem) => void;
}

const ProjectTableResults = memo(function ProjectTableResults({
  projects,
  meta,
  loading,
  error,
  onDelete,
}: ProjectTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (projects.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No projects found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <ProjectDataTable
        projects={projects}
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
// MAIN PROJECTS TABLE
// ==============================

export function ProjectsTable() {
  const {
    projects,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteProject,
  } = useProjects();

  const [selectedProject, setSelectedProject] =
    useState<ProjectItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ==============================
  // CONFIRM DELETE
  // ==============================

  const confirmDelete = useCallback(async () => {
    if (!selectedProject || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteProject(selectedProject.id);

      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedProject, isDeleting, handleDeleteProject]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create Project"
          link="/projects/create-project"
          hideCreate={listLoading || Boolean(listError)}
        />

        <ProjectTableResults
          projects={projects}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedProject}
        />
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={Boolean(selectedProject)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedProject(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Project?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedProject?.title}
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
