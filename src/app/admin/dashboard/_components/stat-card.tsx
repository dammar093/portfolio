"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: React.ReactNode;
  accent?: string;
  href?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  accent = "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  href,
}: StatCardProps) {
  const content = (
    <>
      {/* Background decoration */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-50 blur-2xl ${accent.split(" ")[0]}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h3 className="text-3xl font-bold tracking-tight text-foreground">
            {value.toLocaleString()}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}
        >
          {icon}
        </div>
      </div>

      {description && (
        <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          <div className="text-xs font-medium text-muted-foreground">
            {description}
          </div>

          {href && (
            <ArrowUpRight
              size={16}
              className="shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
            />
          )}
        </div>
      )}

      {!description && href && (
        <div className="relative mt-5 flex items-center justify-end border-t border-border/70 pt-4">
          <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
            View details
          </span>
          <ArrowUpRight
            size={16}
            className="ml-1 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
          />
        </div>
      )}
    </>
  );

  const className = `
    group relative block w-full overflow-hidden rounded-2xl
    border border-border/70 bg-card p-6 text-left
    shadow-sm transition-all duration-300
    hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg
    ${href ? "cursor-pointer" : ""}
  `;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
