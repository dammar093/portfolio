import type { ServiceItem } from "@/app/admin/services/_types/service";
import { ImageWithLoader } from "@/components/shared/ImageWithLoader";

type ServiceCardProps = {
  service: ServiceItem;
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <article className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
      {/* Image */}
      {service.image ? (
        <ImageWithLoader
          src={service.image}
          alt={service.title}
          width={800}
          height={600}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-blue-500/30" />
      )}

      {/* Shadow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

      {/* Title */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        <span className="h-1 w-8 rounded-full bg-teal-400 transition-all duration-300 group-hover:w-14" />
        <h3 className="text-xl font-semibold leading-snug text-white drop-shadow-md">
          {service.title}
        </h3>
      </div>
    </article>
  );
};

export default ServiceCard;