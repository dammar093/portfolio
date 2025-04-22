import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const skills = [
  {
    id: 1,
    name: "HTML",
    icon: "/HTML5.png",
  },
  {
    id: 2,
    name: "CSS",
    icon: "/CSS3.png",
  },
  {
    id: 3,
    name: "JavaScript",
    icon: "/JavaScript.png",
  },
  {
    id: 4,
    name: "TypeScript",
    icon: "/TypeScript.png",
  },
  {
    id: 5,
    name: "React.js",
    icon: "/react.png",
  },
  {
    id: 6,
    name: "Next.js",
    icon: "/Next.js.png",
  },
  {
    id: 7,
    name: "Node.js",
    icon: "/nodejs.png",
  },
  {
    id: 8,
    name: "Express.js",
    icon: "/express.png",
  },
  {
    id: 9,
    name: "MongoDB",
    icon: "/mongodb.png",
  },
  {
    id: 10,
    name: "MySQL",
    icon: "/MySQL.png",
  },
  {
    id: 11,
    name: "Redux",
    icon: "/Redux.png",
  },
  {
    id: 12,
    name: "Git",
    icon: "/Git.png",
  },
  {
    id: 13,
    name: "GitHub",
    icon: "/GitHub.png",
  },
  {
    id: 14,
    name: "Figma",
    icon: "/Figma.png",
  },
  {
    id: 15,
    name: "Postman",
    icon: "/Postman.png",
  },
  {
    id: 16,
    name: "Tailwind CSS",
    icon: "/Tailwind CSS.png",
  },
  {
    id: 17,
    name: "Bootstrap",
    icon: "/Bootstrap.png",
  },
  {
    id: 18,
    name: "Java",
    icon: "/Java.png",
  },
  {
    id: 20,
    name: "Socket.io",
    icon: "/Socket.io.png",
  },
];

const SkillSection = () => {
  return (
    <section className="w-full h-full flex flex-col gap-5 ">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
        Skills
      </h1>
      <div className="w-full h-full flex flex-col gap-5 bg">
        <Marquee pauseOnHover={true} speed={50} gradient={false}>
          <div className="flex overflow-hidden">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 p-2 rounded-md shadow-md bg-white dark:bg-gray-800 mx-1"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  className="w-8 h-8 object-cover"
                  width={32}
                  height={32}
                  loading="lazy"
                />
                <h2 className="text-md font-bold text-gray-800 dark:text-gray-200">
                  {skill.name}
                </h2>
              </div>
            ))}
          </div>
        </Marquee>
        <Marquee
          direction="right"
          pauseOnHover={true}
          speed={50}
          gradient={false}
        >
          <div className="flex overflow-hidden">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 p-2 rounded-md shadow-md bg-white dark:bg-gray-800  mx-1"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  className="w-8 h-8 object-cover"
                  width={32}
                  height={32}
                  loading="lazy"
                />
                <h2 className="text-md font-bold text-gray-800 dark:text-gray-200">
                  {skill.name}
                </h2>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
};

export default SkillSection;
