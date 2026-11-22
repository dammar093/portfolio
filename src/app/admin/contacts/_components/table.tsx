
"use client";

import { memo, useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import {
  Eye,
  Inbox,
  LoaderCircle,
  Mail,
  Trash2
} from "lucide-react";

import Link from "next/link";

import { SearchCreate } from "@/components/admin/shared/Search-carate";

import { useContacts } from "../_hooks/useContactList";

import type {
  ContactItem,
  ContactPaginationMeta,
} from "../_types/contact";

import { Error } from "./error";
import { TableSkeleton } from "./table-skeleton";

// ==============================
// CONTACT DATA TABLE
// ==============================
interface ContactDataTableProps {
  contacts: ContactItem[];
  meta: ContactPaginationMeta;
  onDelete: (contact: ContactItem) => void;
}

const ContactDataTable = memo(function ContactDataTable({
  contacts,
  meta,
  onDelete,
}: ContactDataTableProps) {
  return (
    <Table className="w-full border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">S.N.</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Inquiry</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-20">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {contacts.map((contact, index) => (
          <TableRow
            key={contact.id}
            className={!contact.isSeen ? "bg-muted/30" : ""}
          >
            {/* Serial Number */}
            <TableCell>
              {(meta.page - 1) * meta.limit + index + 1}
            </TableCell>

            {/* Full Name */}
            <TableCell className="font-medium">
              <Link
                href={`/admin/contacts/${contact.id}`}
                className="hover:text-primary"
              >
                {contact.fullname}
              </Link>
            </TableCell>

            {/* Email */}
            <TableCell>
              <a
                href={`mailto:${contact.email}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {contact.email}
              </a>
            </TableCell>

            {/* Inquiry */}
            <TableCell>
              <span className="text-sm">{contact.forWhat}</span>
            </TableCell>

            {/* Message */}
            <TableCell className="max-w-xs">
              <p className="truncate text-sm text-muted-foreground">
                {contact.message}
              </p>
            </TableCell>

            {/* Date */}
            <TableCell className="whitespace-nowrap text-sm">
              {new Date(contact.createdAt).toLocaleDateString()}
            </TableCell>

            {/* Status */}
            <TableCell>
              {contact.isSeen ? (
                <Badge variant="secondary">
                  Seen
                </Badge>
              ) : (
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  Unseen
                </Badge>
              )}
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center gap-1">
                {/* View */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-blue-500"
                    >
                      <Link href={`/admin/contacts/${contact.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    View Contact
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
                      onClick={() => onDelete(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    Delete Contact
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
// CONTACT TABLE RESULTS
// ==============================
interface ContactTableResultsProps {
  contacts: ContactItem[];
  meta: ContactPaginationMeta | null;
  loading: boolean;
  error: string | null;
  onDelete: (contact: ContactItem) => void;
}

const ContactTableResults = memo(function ContactTableResults({
  contacts,
  meta,
  loading,
  error,
  onDelete,
}: ContactTableResultsProps) {
  if (error) return <Error error={error} />;

  if (loading) return <TableSkeleton />;

  if (contacts.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-muted-foreground">
        <Inbox className="mx-auto mb-2 h-8 w-8 opacity-50" />
        No contacts found
      </div>
    );
  }

  if (!meta) return null;

  return (
    <>
      <ContactDataTable
        contacts={contacts}
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
// MAIN CONTACTS TABLE
// ==============================
export function ContactsTable() {
  const {
    contacts,
    listLoading,
    listError,
    meta,
    unseenCount,
    searchInput,
    setSearch,
    isSeen,
    setIsSeen,
    handleDeleteContact,
  } = useContacts();

  const [selectedContact, setSelectedContact] =
    useState<ContactItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ==============================
  // CONFIRM DELETE
  // ==============================
  const confirmDelete = useCallback(async () => {
    if (!selectedContact || isDeleting) return;

    try {
      setIsDeleting(true);

      await handleDeleteContact(selectedContact.id);

      setSelectedContact(null);
    } catch (error) {
      console.error("Failed to delete contact:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedContact, isDeleting, handleDeleteContact]);

  return (
    <>
      <div className="relative flex w-full flex-col gap-5 overflow-x-auto px-1 py-5">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">
                Contact Messages
              </h2>

              <Badge variant="secondary">
                {meta?.total ?? 0} Total
              </Badge>

              <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                <Mail className="mr-1 h-3 w-3" />
                {unseenCount} Unseen
              </Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and review messages received from your website.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={isSeen || "all"}
              onValueChange={setIsSeen}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Contacts
                </SelectItem>

                <SelectItem value="false">
                  Unseen
                </SelectItem>

                <SelectItem value="true">
                  Seen
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SEARCH */}
        <SearchCreate
          search={searchInput}
          onSearch={setSearch}
          title=""
          link=""
          hideCreate
        />

        {/* TABLE */}
        <ContactTableResults
          contacts={contacts}
          meta={meta}
          loading={listLoading}
          error={listError}
          onDelete={setSelectedContact}
        />
      </div>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={Boolean(selectedContact)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setSelectedContact(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Contact?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete the message from{" "}
              <span className="font-semibold text-foreground">
                {selectedContact?.fullname}
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
