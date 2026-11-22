import { fetchProjects } from "@/api/api";
import { ProjectItem } from "@/app/admin/projects/_types/project";
import ProjectCard from "./ProjectCard";
import { FolderCode } from "lucide-react";

const ProjectSection = async () => {
  const projects: ProjectItem[] = await fetchProjects();

  return (
    <section className="w-full flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FolderCode className="h-6 w-6 text-teal-500 dark:text-teal-500" />

            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Featured Projects
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            A collection of projects I've built using modern technologies.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-teal-500 dark:bg-blue-900/30 dark:text-teal-500">
          {projects?.length ?? 0} Projects
        </span>
      </div>

      {/* Project Grid */}
      {projects?.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
          <FolderCode className="h-8 w-8 text-gray-400" />

          <h2 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-100">
            No projects available
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Projects will appear here once they are published.
          </p>
        </div>
      )}
    </section>
  );
};

export default ProjectSection;
