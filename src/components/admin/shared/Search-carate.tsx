"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  search: string;
  title: string;
  link?: string;
  hideCreate?: boolean;
  onSearch: (value: string) => void;
}

export function SearchCreate({
  search,
  onSearch,
  title,
  link,
  hideCreate,
}: Props) {
  return (
    <div className="flex justify-between flex-wrap gap-5">
      <Field className="max-w-80">
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
        />
      </Field>

      {!hideCreate && (
        <Button className="capitalize" variant="default" asChild>
          <Link href={`/admin${link}`}>
            <PlusCircle />
            <span>{title}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
