"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: React.ReactNode;
  accent?: string;
  href?: string; // 🔥 add link
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  accent = "bg-blue-50 text-blue-600",
  href,
}: StatCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm p-6 transition-all duration-300
        ${href ? "cursor-pointer hover:shadow-md hover:-translate-y-1" : ""}
      `}
    >
      {/* Accent bubble */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 ${accent}`}
      />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-lg ${accent}`}>{icon}</div>
      </div>

      <div className="text-3xl font-bold text-gray-800">{value}</div>

      {description && (
        <div className="mt-3 text-sm text-gray-500">{description}</div>
      )}
    </div>
  );
}
