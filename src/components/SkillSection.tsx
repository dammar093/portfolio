import { fetchLanuage } from "@/api/api";
import { LanguageItem } from "@/app/admin/languages/_types/language";
import Marquee from "react-fast-marquee";
import { ImageWithLoader } from "./shared/ImageWithLoader";
import { Code2 } from "lucide-react";

const SkillCard = ({ skill }: { skill: LanguageItem }) => {
  return (
    <div className="group mx-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
      {/* Skill Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-1.5 dark:bg-gray-900">
        {skill.image ? (
          <ImageWithLoader
            src={skill.image}
            alt={skill.name}
            className="h-full w-full object-contain"
            width={44}
            height={44}
            loading="lazy"
          />
        ) : (
          <Code2 className="h-6 w-6 text-gray-400" />
        )}
      </div>

      {/* Skill Name */}
      <h2 className="whitespace-nowrap text-sm font-semibold text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
        {skill.name}
      </h2>
    </div>
  );
};

const SkillSection = async () => {
  const skills: LanguageItem[] = await fetchLanuage();

  const activeSkills = skills
    .filter((skill) => skill.isActive)
    .sort((a, b) => a.order - b.order);

  if (!activeSkills.length) return null;

  const firstRow = activeSkills.filter((_, index) => index % 2 === 0);
  const secondRow = activeSkills.filter((_, index) => index % 2 !== 0);

  return (
    <section className="w-full flex flex-col gap-6 overflow-hidden">
      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-teal-500 dark:text-teal-500" />

            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Skills & Technologies
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Technologies and tools I use to build modern applications.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-teal-500 dark:bg-blue-900/30 dark:text-teal-500">
          {activeSkills.length} Skills
        </span>
      </div>

      {/* Skill Marquees */}
      <div className="flex flex-col gap-3">
        <Marquee pauseOnHover speed={40} gradient={false} autoFill>
          {firstRow.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </Marquee>

        {secondRow.length > 0 && (
          <Marquee
            direction="right"
            pauseOnHover
            speed={40}
            gradient={false}
            autoFill
          >
            {secondRow.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
};

export default SkillSection;
