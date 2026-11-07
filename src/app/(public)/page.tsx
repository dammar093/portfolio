import React from "react";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectSection from "@/components/ProjectSection";
import SkillSection from "@/components/SkillSection";

const Home = () => {
  return (
    <section className="px-2 md:px-20 w-full h-full flex flex-col items-center gap-10">
      <HeroSection />
      <SkillSection />
      <ExperienceSection />
      <ProjectSection />
    </section>
  );
};

export default Home;
