
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

import { useServices } from "../_hooks/useServiceList";

import type {
  ServiceItem,
  ServicePaginationMeta,
} from "../_types/service";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// Service Data Table
interface ServiceDataTableProps {
  services: ServiceItem[];
  meta: ServicePaginationMeta;
  onDelete: (service: ServiceItem) => void;
}

const ServiceDataTable = memo(function ServiceDataTable({
  services,
  meta,
  onDelete,
}: ServiceDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {services.map((service, index) => (
          <TableRow key={service.id}>
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            <TableCell>
              {service.image ? (
                <div className="relative aspect-square w-12 overflow-hidden rounded">
                  <Image
                    src={service.image}
                    alt={service.title}
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

            <TableCell className="font-medium capitalize">
              {service.title}
            </TableCell>

            <TableCell>{service.order}</TableCell>

            <TableCell>
              <p className="max-w-xs truncate text-sm text-muted-foreground">
                {service.description}
              </p>
            </TableCell>

            {/* Status */}
            <TableCell>
              {service.isActive ? (
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
                      <Link href={`/admin/services/${service.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Edit Service
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
                      onClick={() => onDelete(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Delete Service
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

// Service Table Results
interface ServiceTableResultsProps {
  services: ServiceItem[];
  meta: ServicePaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (service: ServiceItem) => void;
}

const ServiceTableResults = memo(function ServiceTableResults({
  services,
  meta,
  loading,
  error,
  onDelete,
}: ServiceTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (services.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        No services found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <ServiceDataTable
        services={services}
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

// Main Services Table
export function ServicesTable() {
  const {
    services,
    listLoading,
    listError,
    meta,
    searchInput,
    setSearch,
    handleDeleteService,
  } = useServices();

  const [selectedService, setSelectedService] =
    useState<ServiceItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = useCallback(async () => {
    if (!selectedService || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteService(selectedService.id);

      setSelectedService(null);
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedService, isDeleting, handleDeleteService]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title="Create Service"
          link="/services/create-service"
          hideCreate={listLoading || Boolean(listError)}
        />

        <ServiceTableResults
          services={services}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedService}
        />
      </div>

      <AlertDialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedService(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Service?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedService?.title}
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
