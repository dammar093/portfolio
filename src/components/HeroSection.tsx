import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="flex justify-between flex-wrap-reverse gap-5">
      <div className="w-full md:w-[80%]">
        <div className="w-ful md:w-[90%]">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
            Dammar Singh Rana
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-justify">
            I&apos;m a software engineer with a passion for building web
            applications. I love to learn new technologies and improve my
            skills.
          </p>
        </div>
      </div>
      <div className="w-full md:w-[10%]">
        <div className="w-26 h-26 bg-blue-500 rounded-sm overflow-hidden">
          <Image
            src={"/hero.png"}
            className="w-full h-full object-scale-down"
            width={100}
            height={100}
            loading="lazy"
            alt="Dammar Singh Rana"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
