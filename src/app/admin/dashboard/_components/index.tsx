"use client";

import { FileText, Package, Wrench, BookOpen, Layers } from "lucide-react";
import { useDashboard } from "../_hooks/useDashboard";
import StatCard from "./stat-card";
import SectionCard from "./section-card";
import DashboardSkeleton from "./loading";

export function DashboardOverview() {
  const { dashboard, loading } = useDashboard();

  if (loading || !dashboard) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Quotes Section */}
      <SectionCard title="Quotes Overview">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Quotes"
            value={dashboard.quotes.total}
            icon={<FileText size={20} />}
            accent="bg-blue-100 text-blue-600"
            href="/admin/quotes"
            description={
              <div className="flex gap-3">
                <span>Pending: {dashboard.quotes.pending}</span>
                <span>Contacted: {dashboard.quotes.contacted}</span>
              </div>
            }
          />

          <StatCard
            title="Processing"
            value={dashboard.quotes.processing}
            icon={<Layers size={20} />}
            accent="bg-purple-100 text-purple-600"
            href="/admin/quotes?status=PROCESSING"
            description={<span>Cancelled: {dashboard.quotes.cancelled}</span>}
          />
        </div>
      </SectionCard>

      {/* Entities Section */}
      <SectionCard title="Content Overview">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Products"
            value={dashboard.products.total}
            icon={<Package size={20} />}
            accent="bg-green-100 text-green-600"
            href="/admin/products"
            description={
              <>
                Active: {dashboard.products.active} | Inactive:{" "}
                {dashboard.products.inactive}
              </>
            }
          />

          <StatCard
            title="Services"
            value={dashboard.services.total}
            icon={<Wrench size={20} />}
            accent="bg-yellow-100 text-yellow-600"
            href="/admin/services"
            description={
              <>
                Active: {dashboard.services.active} | Inactive:{" "}
                {dashboard.services.inactive}
              </>
            }
          />

          <StatCard
            title="Blogs"
            value={dashboard.blogs.total}
            icon={<BookOpen size={20} />}
            accent="bg-indigo-100 text-indigo-600"
            href="/admin/blogs"
            description={
              <>
                Active: {dashboard.blogs.active} | Inactive:{" "}
                {dashboard.blogs.inactive}
              </>
            }
          />

          <StatCard
            title="Packages"
            value={dashboard.packages.total}
            icon={<Layers size={20} />}
            accent="bg-pink-100 text-pink-600"
            href="/admin/packages"
            description={
              <>
                Active: {dashboard.packages.active} | Inactive:{" "}
                {dashboard.packages.inactive}
              </>
            }
          />
        </div>
      </SectionCard>
    </div>
  );
}
