import { fetchExperiences } from "@/api/api";
import { ExperienceItem } from "@/app/admin/experiences/_types/experience";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { ImageWithLoader } from "./shared/ImageWithLoader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const ExperienceCard = ({ experience }: { experience: ExperienceItem }) => {
  return (
    <article className="group relative flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 md:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Company Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            {experience.image ? (
              <ImageWithLoader
                src={experience.image}
                alt={experience.company}
                width={48}
                height={48}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <BriefcaseBusiness size={22} className="text-gray-400" />
            )}
          </div>

          {/* Position and Company */}
          <div className="min-w-0">
            <h2 className="break-words text-[15px] font-bold text-gray-800 dark:text-gray-100 md:text-lg">
              {experience.position}
            </h2>

            <p className="mt-1 text-sm font-medium text-teal-500 dark:text-teal-500">
              {experience.company}
            </p>
          </div>
        </div>

        {/* Current Status */}
        {experience.isCurrent && (
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Current
          </span>
        )}
      </div>

      {/* Employment Type */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {String(experience.employmentType).replace(/_/g, " ")}
        </span>
      </div>

      {/* Date and Location */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />

          <span>
            {formatDate(experience.joinDate)} -{" "}
            {experience.isCurrent || !experience.leaveDate
              ? "Present"
              : formatDate(experience.leaveDate)}
          </span>
        </div>

        {experience.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{experience.location}</span>
          </div>
        )}
      </div>
    </article>
  );
};

const ExperienceSection = async () => {
  const experiences: ExperienceItem[] = await fetchExperiences();

  return (
    <section className="flex w-full flex-col gap-6">
      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness
              size={22}
              className="text-teal-500 dark:text-teal-500"
            />

            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Work Experience
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            My professional journey and career experience.
          </p>
        </div>

        <span className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-teal-500 dark:bg-gray-800 dark:text-teal-500">
          {experiences.length}{" "}
          {experiences.length === 1 ? "Experience" : "Experiences"}
        </span>
      </div>

      {/* Experience Cards */}
      {experiences.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
          <BriefcaseBusiness size={32} className="text-gray-400" />

          <h2 className="mt-3 font-semibold text-gray-700 dark:text-gray-200">
            No experience available
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Work experience will appear here.
          </p>
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;
