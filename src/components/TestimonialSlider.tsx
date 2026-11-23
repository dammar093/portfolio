"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareQuote,
  Quote,
} from "lucide-react";

import type { TestimonialItem } from "@/app/admin/testimonials/_types/testimonial";
import { ImageWithLoader } from "@/components/shared/ImageWithLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Avatar = ({
  name,
  avatar,
  size = 48,
}: {
  name: string;
  avatar: string | null;
  size?: number;
}) => (
  <div
    style={{ width: size, height: size }}
    className="relative shrink-0 overflow-hidden rounded-full bg-teal-500/10"
  >
    {avatar ? (
      <ImageWithLoader
        src={avatar}
        alt={name}
        width={size * 2}
        height={size * 2}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-teal-600 dark:text-teal-400">
        {getInitials(name)}
      </span>
    )}
  </div>
);

const Person = ({ item, size }: { item: TestimonialItem; size?: number }) => (
  <div className="flex items-center gap-3">
    <Avatar name={item.name} avatar={item.avatar} size={size} />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
        {item.name}
      </p>
      <p className="break-words text-xs text-gray-500 dark:text-gray-400">
        {item.position}
        {item.company ? ` at ${item.company}` : ""}
      </p>
    </div>
  </div>
);

const TestimonialCard = ({
  item,
  onOpen,
}: {
  item: TestimonialItem;
  onOpen: (item: TestimonialItem) => void;
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);

  // Show "Read more" only when the text is actually cut off
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const check = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [item.testimonial]);

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 p-6 dark:border-white/10 dark:bg-white/[0.03]">
      <Quote className="h-7 w-7 text-teal-500" />

      <div className="flex flex-1 flex-col gap-2">
        <p
          ref={textRef}
          className="line-clamp-5 text-sm leading-7 text-gray-600 dark:text-gray-300"
        >
          {item.testimonial}
        </p>

        {truncated && (
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="w-fit text-sm font-medium text-teal-600 transition hover:text-teal-500 dark:text-teal-400"
          >
            Read more
          </button>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4 dark:border-white/10">
        <Person item={item} />
      </div>
    </article>
  );
};

const TestimonialSlider = ({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hasMultiple, setHasMultiple] = useState(false);
  const [active, setActive] = useState<TestimonialItem | null>(null);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    // More than one snap means there are slides outside the view
    setHasMultiple(emblaApi.scrollSnapList().length > 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update).on("reInit", update);
    return () => {
      emblaApi.off("select", update).off("reInit", update);
    };
  }, [emblaApi, update]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-6 w-6 text-teal-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl">
              Testimonials
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            What people say about working with me.
          </p>
        </div>

        {hasMultiple && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous testimonials"
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-teal-500 hover:bg-teal-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-700 dark:border-white/10 dark:text-gray-300 dark:disabled:hover:border-white/10 dark:disabled:hover:text-gray-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Next testimonials"
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-teal-500 hover:bg-teal-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-700 dark:border-white/10 dark:text-gray-300 dark:disabled:hover:border-white/10 dark:disabled:hover:text-gray-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Slider: 1 on mobile, 2 on md, 3 on lg */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-5 flex">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="min-w-0 flex-[0_0_100%] pl-5 md:flex-[0_0_50%] lg:flex-[0_0_33.3333%]"
            >
              <TestimonialCard item={item} onOpen={setActive} />
            </div>
          ))}
        </div>
      </div>

      {/* Full testimonial modal */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {active && (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="sr-only">
                  Testimonial from {active.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Full testimonial text
                </DialogDescription>
                <Person item={active} size={56} />
              </DialogHeader>

              <Quote className="h-6 w-6 text-teal-500" />
              <p className="whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">
                {active.testimonial}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialSlider;
