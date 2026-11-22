import { fetchLanuage } from "@/api/api";
import { LanguageItem } from "@/app/admin/languages/_types/language";
import Marquee from "react-fast-marquee";
import { ImageWithLoader } from "./shared/ImageWithLoader";

const SkillSection = async () => {
  const skills = await fetchLanuage();
  return (
    <section className="w-full h-full flex flex-col gap-5 ">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
        Skills
      </h1>
      <div className="w-full h-full flex flex-col gap-5 bg">
        <Marquee pauseOnHover={true} speed={50} gradient={false}>
          <div className="flex overflow-hidden">
            {skills.map((skill: LanguageItem) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 p-2 rounded-md shadow-md bg-white dark:bg-gray-800 mx-1"
              >
                <ImageWithLoader
                  src={skill.image}
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
            {skills.map((skill: LanguageItem) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 p-2 rounded-md shadow-md bg-white dark:bg-gray-800  mx-1"
              >
                <ImageWithLoader
                  src={skill.image}
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
