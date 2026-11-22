import { fetchSetting } from "@/api/api";
import { ImageWithLoader } from "./shared/ImageWithLoader";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const HeroSection = async () => {
  const setting = await fetchSetting();
  return (
    <section className="w-full flex flex-col gap-5">
      {/* Logo */}
      {setting?.logo && (
        <div className="shrink-0 w-20 h-20 md:w-26 md:h-26 rounded-full overflow-hidden">
          <ImageWithLoader
            src={setting.logo}
            className="w-full h-full object-scale-down"
            width={104}
            height={104}
            loading="lazy"
            alt={setting?.name || "Website logo"}
          />
        </div>
      )}
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          {setting?.name}
        </h1>
        <p className=" text-gray-600 dark:text-gray-400 text-justify">
          Software Engineer
        </p>
        <p className=" text-gray-600 dark:text-gray-400 text-justify">
          {setting?.description}
        </p>
        <Link
          href={`/contact`}
          className="flex w-fit items-center justify-center gap-2 rounded-lg bg-teal-500 px-3 py-2.5 text-sm font-semibold text-white"
        >
          Contact Us
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
