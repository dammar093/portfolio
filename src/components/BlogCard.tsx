import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { BlogItem } from "@/app/admin/blogs/_types/blog";
import { ImageWithLoader } from "./shared/ImageWithLoader";
import { htmlToString } from "@/lib/html-to-string";


const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const BlogCard = ({ blog }: { blog: BlogItem }) => {
  const excerpt = htmlToString(blog.description || "");

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Blog Image */}
      <Link
        href={`/blogs/${blog.slug}`}
        className="relative block h-60 w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
        aria-label={`Read ${blog.title}`}
      >
        {blog.image ? (
          <ImageWithLoader
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover"
            width={600}
            height={550}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 dark:text-gray-600">
            No image
          </div>
        )}
      </Link>

      {/* Blog Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <CalendarDays size={14} />
          <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
        </div>

        <h2 className="line-clamp-2 text-lg font-bold text-gray-800 dark:text-gray-100">
          {blog.title}
        </h2>

        {excerpt && (
          <p className="line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {excerpt}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
          <Link
            href={`/blogs/${blog.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Read More
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;