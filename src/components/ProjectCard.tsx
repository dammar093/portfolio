import { ProjectItem } from "@/app/admin/projects/_types/project";
import Link from "next/link";
import { ImageWithLoader } from "./shared/ImageWithLoader";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Project Image */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative block h-60 w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
        aria-label={`View ${project.title} details`}
      >
        <ImageWithLoader
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          width={600}
          height={550}
          loading="lazy"
        />
      </Link>

      {/* Project Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-5">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {project.title}
        </h2>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
          <Link
            href={`/projects/${project.slug}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-500 px-3 py-2.5 text-sm font-semibold text-white"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>

          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              Live Preview
              <ExternalLink size={15} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
