import React from "react";
import ProjectCard from "./ProjectCard";

export const projects = [
  {
    id: 1,
    name: "Ecommerce",
    description: "A full-stack ecommerce website.",
    image: "/mart.png",
    link: "https://mart-liart.vercel.app",
    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "Redux",
      "eSewa",
      "cloudinary",
    ],
  },
  {
    id: 2,
    name: "Moonlight Photography",
    description: "A photography portfolio website.",
    image: "/moonligh.png",
    link: "https://moonlight-photography-three.vercel.app/",
    stack: ["React.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
  },
];

const ProjectSection = () => {
  return (
    <section className="w-full h-full flex flex-col gap-5">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
        Projects
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center md:justify-between ">
        {projects?.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
