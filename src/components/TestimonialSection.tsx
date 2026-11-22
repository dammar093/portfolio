import { MessageSquareQuote } from "lucide-react";

import { fetchTestimonials } from "@/api/api";
import type { TestimonialItem } from "@/app/admin/testimonials/_types/testimonial";
import TestimonialSlider from "./TestimonialSlider";

const TestimonialSection = async () => {
  const all: TestimonialItem[] = (await fetchTestimonials()) ?? [];

  const testimonials = all
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="flex w-full flex-col gap-6">
      {testimonials.length > 0 ? (
        <TestimonialSlider testimonials={testimonials} />
      ) : (
        <>
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-6 w-6 text-teal-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Testimonials
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
            <MessageSquareQuote className="h-8 w-8 text-gray-400" />
            <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-100">
              No testimonials yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kind words from clients will appear here.
            </p>
          </div>
        </>
      )}
    </section>
  );
};

export default TestimonialSection;