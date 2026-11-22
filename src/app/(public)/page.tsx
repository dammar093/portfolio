import React from "react";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectSection from "@/components/ProjectSection";
import SkillSection from "@/components/SkillSection";
import ServiceSection from "@/components/ServicesSection";

const Home = () => {
  return (
    <section className=" w-full h-full flex flex-col items-center gap-10">
      <HeroSection />
      <ExperienceSection />
      <ProjectSection />
      <ServiceSection />
      <SkillSection />
    </section>
  );
};

export default Home;
