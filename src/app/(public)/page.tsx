import React from "react";
import HeroSection from "@/components/HeroSection";
import ProjectSection from "@/components/ProjectSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillSection from "@/components/SkillSection";
import ServiceSection from "@/components/ServicesSection";
import TestimonialSection from "@/components/TestimonialSection";
import FaqSection from "@/components/FaqsSection";

const Home = () => {
  return (
    <section className="flex h-full w-full flex-col items-center gap-16">
      <HeroSection />
      <ProjectSection />
      <ExperienceSection />
      <SkillSection />
      <ServiceSection />
      <TestimonialSection />
      <FaqSection />
    </section>
  );
};

export default Home;