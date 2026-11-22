import { ArrowUpRight, Briefcase } from "lucide-react";

import { fetchServices } from "@/api/api";
import type { ServiceItem } from "@/app/admin/services/_types/service";
import ServiceCard from "./ServcieCard";
import Link from "next/link";

const ServiceSection = async () => {
  const services: ServiceItem[] = (await fetchServices()) ?? [];
  const count = services.length;

  return (
    <section className="flex w-full flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-teal-500" />

            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Services
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Solutions I offer to help bring your ideas to life.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end md:justify-between gap-3 ">
          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-teal-500 dark:bg-blue-900/30 dark:text-teal-500">
            {services?.length ?? 0} Services
          </span>

          <Link
            href="/services"
            className="group flex w-fit items-center gap-1 text-xs font-medium text-teal-500 transition-colors hover:text-teal-600 dark:hover:text-teal-400"
          >
            View All
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Service Grid */}
      {count > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
          <Briefcase className="h-8 w-8 text-gray-400" />

          <h2 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-100">
            No services available
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Services will appear here once they are published.
          </p>
        </div>
      )}
    </section>
  );
};

export default ServiceSection;
