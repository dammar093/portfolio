import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import Header from "@/components/layout/Header";

const quickLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-[#18181B] dark:text-gray-100">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-400/5" />
          <span className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-teal-500/60" />
          <span className="absolute right-[16%] top-[28%] h-3 w-3 rounded-full bg-teal-500/30" />
          <span className="absolute bottom-[18%] right-[25%] h-2 w-2 rounded-full bg-teal-500/50" />
        </div>

        <section className="relative w-full max-w-2xl text-center">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/10 text-teal-600 shadow-sm dark:text-teal-400">
            <Compass size={30} strokeWidth={1.7} />
          </div>

          <p className="font-mono text-[clamp(6rem,20vw,12rem)] font-bold leading-[0.8] tracking-[-0.09em] text-gray-200 dark:text-white/[0.07]">
            404
          </p>

          <div className="-mt-3 sm:-mt-5">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-400">
              Page not found
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Looks like you took a wrong turn.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
              The page may have moved, or the link may be out of date. Let’s get
              you back to something useful.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 font-semibold text-white shadow-sm transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#18181B]"
            >
              <ArrowLeft size={18} />
              Back to home
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-6 font-semibold text-gray-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-white/15 dark:bg-white/5 dark:text-gray-100 dark:hover:text-teal-400"
            >
              Explore projects
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <nav aria-label="Helpful links" className="mt-10">
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-500">
              Or explore these pages
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-gray-600 transition hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>

      <footer className="border-t border-gray-200 px-4 py-5 text-center text-xs text-gray-500 dark:border-white/10 dark:text-gray-500">
        Dammar Singh Rana · Software Engineer
      </footer>
    </div>
  );
}
