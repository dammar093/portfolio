"use client";

import {
  BriefcaseBusiness,
  Code,
  FileText,
  FolderKanban,
  MessageSquare,
  Newspaper,
  Settings,
  Users,
  Wrench,
  Star,
  HelpCircle,
  File,
} from "lucide-react";

import { useDashboard } from "../_hooks/useDashboard";

import StatCard from "./stat-card";
import SectionCard from "./section-card";
import DashboardSkeleton from "./dashboard-skeleton";

export function DashboardOverview() {
  const { stats, loading, error, refetch } = useDashboard();

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border p-10 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* General Overview */}
      <SectionCard title="General Overview">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={<Users size={20} />}
            accent="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Total Pages"
            value={stats.pages}
            icon={<File size={20} />}
            accent="bg-purple-100 text-purple-600"
            href="/admin/pages"
          />

          <StatCard
            title="Website Settings"
            value={stats.settings}
            icon={<Settings size={20} />}
            accent="bg-gray-100 text-gray-600"
            href="/admin/settings"
          />
        </div>
      </SectionCard>

      {/* Dashboard Sections Grid */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        {/* Content Overview */}
        <SectionCard title="Content Overview">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Projects"
              value={stats.projects.total}
              icon={<FolderKanban size={20} />}
              accent="bg-green-100 text-green-600"
              href="/admin/projects"
              description={
                <>
                  Active: {stats.projects.active} | Inactive:{" "}
                  {stats.projects.inactive}
                </>
              }
            />

            <StatCard
              title="Languages"
              value={stats.languages.total}
              icon={<Code size={20} />}
              accent="bg-purple-100 text-purple-600"
              href="/admin/languages"
              description={
                <>
                  Active: {stats.languages.active} | Inactive:{" "}
                  {stats.languages.inactive}
                </>
              }
            />

            <StatCard
              title="Services"
              value={stats.services.total}
              icon={<Wrench size={20} />}
              accent="bg-yellow-100 text-yellow-600"
              href="/admin/services"
              description={
                <>
                  Active: {stats.services.active} | Inactive:{" "}
                  {stats.services.inactive}
                </>
              }
            />

            <StatCard
              title="Blogs"
              value={stats.blogs.total}
              icon={<Newspaper size={20} />}
              accent="bg-indigo-100 text-indigo-600"
              href="/admin/blogs"
              description={
                <>
                  Active: {stats.blogs.active} | Inactive:{" "}
                  {stats.blogs.inactive}
                </>
              }
            />
          </div>
        </SectionCard>

        {/* Portfolio Overview */}
        <SectionCard title="Portfolio Overview">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Experiences"
              value={stats.experiences.total}
              icon={<BriefcaseBusiness size={20} />}
              accent="bg-orange-100 text-orange-600"
              href="/admin/experiences"
              description={
                <>
                  Active: {stats.experiences.active} | Inactive:{" "}
                  {stats.experiences.inactive}
                </>
              }
            />

            <StatCard
              title="Testimonials"
              value={stats.testimonials.total}
              icon={<Star size={20} />}
              accent="bg-pink-100 text-pink-600"
              href="/admin/testimonials"
              description={
                <>
                  Active: {stats.testimonials.active} | Inactive:{" "}
                  {stats.testimonials.inactive}
                </>
              }
            />

            <StatCard
              title="FAQs"
              value={stats.faqs.total}
              icon={<HelpCircle size={20} />}
              accent="bg-cyan-100 text-cyan-600"
              href="/admin/faqs"
              description={
                <>
                  Active: {stats.faqs.active} | Inactive: {stats.faqs.inactive}
                </>
              }
            />
          </div>
        </SectionCard>

        {/* Contact Overview */}
        <SectionCard title="Contact Overview">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Total Messages"
              value={stats.contacts.total}
              icon={<MessageSquare size={20} />}
              accent="bg-blue-100 text-blue-600"
              href="/admin/contacts"
              description={
                <>
                  Seen: {stats.contacts.seen} | Unseen: {stats.contacts.unseen}
                </>
              }
            />

            <StatCard
              title="Unseen Messages"
              value={stats.contacts.unseen}
              icon={<FileText size={20} />}
              accent="bg-red-100 text-red-600"
              href="/admin/contacts?isSeen=false"
              description="Messages waiting to be reviewed"
            />
          </div>
        </SectionCard>
      </div>

      {loading && (
        <p className="text-right text-xs text-muted-foreground">
          Updating dashboard statistics...
        </p>
      )}
    </div>
  );
}
