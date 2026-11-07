"use client";

import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({ title, children }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}
