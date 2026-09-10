"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  inactiveProjects: number;
  totalLanguages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    inactiveProjects: 0,
    totalLanguages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token");
      }

      const [projectsRes, languagesRes] = await Promise.all([
        fetch("/api/admin/projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/languages", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projectsRes.ok || !languagesRes.ok) {
        throw new Error("Failed to fetch stats");
      }

      const projectsData = await projectsRes.json();
      const languagesData = await languagesRes.json();

      const projects = projectsData.data || [];
      const languages = languagesData || [];

      setStats({
        totalProjects: projects.length,
        activeProjects: projects.filter((p: { status: string }) => p.status === "active").length,
        inactiveProjects: projects.filter((p: { status: string }) => p.status === "inactive").length,
        totalLanguages: languages.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your portfolio admin panel</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Total Projects</p>
              <p className="text-4xl font-bold text-white mt-2">
                {stats.totalProjects}
              </p>
            </div>
            <div className="text-4xl">📁</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Active</p>
              <p className="text-4xl font-bold text-green-400 mt-2">
                {stats.activeProjects}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Inactive</p>
              <p className="text-4xl font-bold text-red-400 mt-2">
                {stats.inactiveProjects}
              </p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Languages</p>
              <p className="text-4xl font-bold text-purple-400 mt-2">
                {stats.totalLanguages}
              </p>
            </div>
            <div className="text-4xl">🌐</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/projects"
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-2">📁 Manage Projects</h3>
          <p className="text-gray-400">Create, edit, and manage your portfolio projects</p>
        </Link>

        <Link
          href="/admin/languages"
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-2">🌐 Manage Languages</h3>
          <p className="text-gray-400">Add and manage programming languages and tools</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-2">👥 Manage Users</h3>
          <p className="text-gray-400">Create and manage admin and user accounts</p>
        </Link>
      </div>
    </div>
  );
}
