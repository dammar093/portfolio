
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bell, Mail, MessageSquare, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";
import { fetchContacts } from "@/app/admin/contacts/_redux/contact-thunk";

export default function NotificationPanel() {
  const dispatch = useAppDispatch();

  const { data, unseenCount, listLoading } = useAppSelector(
    (state) => state.contacts,
  );

  // Fetch unseen contacts when the header notification mounts
  useEffect(() => {
    dispatch(
      fetchContacts({
        page: 1,
        limit: 20,
        isSeen: false,
      }),
    );
  }, [dispatch]);

  const unseenContacts = data.filter((contact) => !contact.isSeen);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />

          {unseenCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {unseenCount > 99 ? "99+" : unseenCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-5 text-left">
          <div className="flex items-center justify-between pr-6">
            <div>
              <SheetTitle className="flex items-center gap-2">
                Notifications
                {unseenCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {unseenCount}
                  </span>
                )}
              </SheetTitle>

              <SheetDescription className="mt-1">
                You have {unseenCount} unseen contact messages.
              </SheetDescription>
            </div>

            <Bell className="size-5 text-muted-foreground" />
          </div>
        </SheetHeader>

        <div className="flex items-center justify-between border-b px-5 py-3">
          <p className="text-sm font-semibold">Unseen messages</p>

          <Link
            href="/admin/contacts"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Only this section scrolls */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {listLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">
                Loading notifications...
              </p>
            </div>
          ) : unseenContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <Mail className="size-7 text-muted-foreground" />
              </div>

              <p className="font-medium">No new notifications</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You are all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {unseenContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/admin/contacts/${contact.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-2">
                      <MessageSquare className="size-4 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {contact.fullname}
                        </p>

                        <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                      </div>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {contact.email}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-foreground">
                        {contact.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-muted-foreground">
                          {contact.forWhat}
                        </span>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <Link href="/admin/contacts" className="block">
            <Button className="w-full" variant="outline">
              View all messages
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
