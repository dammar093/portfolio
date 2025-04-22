import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProjectCard = ({
  link,
  image,
  name,
  description,
  stack,
}: {
  link: string;
  image: string;
  name: string;
  description: string;
  stack: string[];
}) => {
  return (
    <div className="flex flex-col gap-2 bg-white p-2 md:p-5 rounded-md shadow dark:bg-gray-800 ">
      <Link
        href={link}
        target="_blank"
        className="w-full h-48 relative rounded-md overflow-hidden"
      >
        <Image
          src={image}
          alt="Portfolio Website"
          className="w-full h-full object-cover rounded-md"
          width={500}
          height={300}
          loading="lazy"
        />
      </Link>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
        {name}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {stack?.map((item, index) => (
          <span
            key={index}
            className="text-gray-600 dark:text-gray-400 text-sm font-semibold bg-gray-200 dark:bg-gray-700 rounded p-1 inline-block"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
