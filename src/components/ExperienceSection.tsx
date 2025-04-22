import React from "react";

const ExperienceSection = () => {
  return (
    <section className="w-full h-full flex flex-col gap-5">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
        Work Experience
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 bg-white p-2 md:p-5 rounded-md shadow dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Frontend Developer Intern
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Geek Tech Solutions Pvt. Ltd.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            November 2024 - February 2025
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
