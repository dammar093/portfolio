"use client";

import React from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export default function SectionCard({
  title,
  children,
  description,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`
        relative overflow-hidden rounded-2xl
        border border-border/70 bg-card
        p-5 shadow-sm sm:p-6
        ${className}
      `}
    >
      {/* Section Header */}
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Section Content */}
      <div className="min-w-0">{children}</div>
    </section>
  );
}
