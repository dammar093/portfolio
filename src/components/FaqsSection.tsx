import { CircleHelp } from "lucide-react";

import { fetchFaqs } from "@/api/api";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FaqSection = async () => {
  const faqs: FaqItem[] = (await fetchFaqs()) ?? [];
  const count = faqs.length;

  return (
    <section className="flex w-full flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Frequently Asked Questions
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Quick answers to the questions I get asked most often.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-500">
          {count} {count === 1 ? "FAQ" : "FAQs"}
        </span>
      </div>

      {/* FAQ List */}
      {count > 0 ? (
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-2xl border border-gray-200 px-5 transition-colors data-[state=open]:border-teal-500/50 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900 hover:no-underline dark:text-white">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent>
                <div
                  className="rich-content text-sm"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
          <CircleHelp className="h-8 w-8 text-gray-400" />

          <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-100">
            No FAQs available
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Questions and answers will appear here once they are published.
          </p>
        </div>
      )}
    </section>
  );
};

export default FaqSection;
