
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Mail,
  User,
  MessageSquare,
  CalendarDays,
  BriefcaseBusiness,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { fetchContact } from "../_redux/contact-thunk";

export default function ContactDetails() {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentContact, loading, error } = useAppSelector(
    (state) => state.contacts,
  );

  useEffect(() => {
    if (params.id) {
      dispatch(fetchContact(params.id));
    }
  }, [dispatch, params.id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !currentContact) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12">
          <MessageSquare className="size-10 text-muted-foreground" />

          <p className="font-medium">
            {error || "Contact message not found"}
          </p>

          <Button asChild variant="outline">
            <Link href="/admin/contacts">
              <ArrowLeft className="mr-2 size-4" />
              Back to Contacts
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const contact = currentContact;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contact Details
          </h1>

          <p className="text-sm text-muted-foreground">
            View customer contact information and message.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/contacts">
            <ArrowLeft className="mr-2 size-4" />
            Back to Contacts
          </Link>
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Customer details submitted through the contact form.
              </CardDescription>
            </div>

            <Badge
              variant={contact.isSeen ? "secondary" : "default"}
            >
              {contact.isSeen ? "Seen" : "Unseen"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2">
              <User className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">
                Full Name
              </p>
              <p className="break-words font-medium">
                {contact.fullname}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2">
              <Mail className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">
                Email Address
              </p>

              <a
                href={`mailto:${contact.email}`}
                className="break-all font-medium text-primary hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>

          {/* Inquiry Type */}
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2">
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">
                Inquiry Type
              </p>
              <p className="break-words font-medium">
                {contact.forWhat}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-muted p-2">
              <CalendarDays className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm text-muted-foreground">
                Submitted Date
              </p>
              <p className="font-medium">
                {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            Customer Message
          </CardTitle>

          <CardDescription>
            Message submitted by {contact.fullname}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="min-h-40 whitespace-pre-wrap break-words rounded-lg border bg-muted/30 p-5 text-sm leading-7">
            {contact.message}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={`mailto:${contact.email}`}>
            <Mail className="mr-2 size-4" />
            Reply via Email
          </a>
        </Button>

        <Button asChild variant="outline">
          <Link href="/admin/contacts">
            Back to Contacts
          </Link>
        </Button>
      </div>
    </div>
  );
}
