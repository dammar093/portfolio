import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/components/ProjectSection";
import Link from "next/link";
import React from "react";

const Projects = () => {
  return (
    <section className="px-2 md:px-20 w-full h-full flex flex-col gap-5">
      <meta
        name="description"
        content="Explore projects showcasing my work and skills. Visit my GitHub for more details."
      />
      <title>Projects - Portfolio</title>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Projects
      </h1>
      <div>
        <p>
          Here are some of the projects I have worked on. You can find the code
          for these projects on my GitHub profile -
          <Link
            className="text-blue-500 border-b border-blue-500"
            href={"https://github.com/dammar093"}
          >
            {" "}
            github
          </Link>
          .
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center md:justify-between ">
        {projects?.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
