import { fetchSetting } from "@/api/api";
import { ImageWithLoader } from "./shared/ImageWithLoader";

const HeroSection = async () => {
  const setting = await fetchSetting();
  return (
    <section className="w-full flex items-start gap-5">
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          {setting?.name}
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-400 text-justify">
          {setting?.description}
        </p>
      </div>

      {/* Logo */}
      {setting?.logo && (
        <div className="shrink-0 w-20 h-20 md:w-26 md:h-26 rounded-sm overflow-hidden">
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
    </section>
  );
};

export default HeroSection;
